import "server-only";
import type { z } from "zod";
import type { ActionResult } from "@/lib/action-result";
import { updateTags, type TagResolver } from "@/server/core/cache";
import { normalizeError } from "@/server/core/errors/normalize";
import { toFieldErrors } from "@/server/core/errors/zod-error";
import { logger, newRequestId } from "@/server/core/logger";
import { getAdmin, type AdminUser } from "@/server/modules/auth/auth.guard";

// Every Server Action goes through one of these wrappers, which do the same
// steps in the same order: authenticate, parse with Zod, run the service,
// expire the mutation's cache tags, log, and return a typed result. Server
// Actions are public endpoints, so none of that is optional. Action files add
// "use server" and export the wrapped function; nothing here throws to the
// client.

export type ActionInput<S extends z.ZodType> = FormData | z.input<S>;

export type ActionFn<S extends z.ZodType, T> = (
  prevState: unknown,
  input: ActionInput<S>,
) => Promise<ActionResult<T>>;

interface ActionOptions<S extends z.ZodType, T> {
  /** Cache tags this mutation expires (updateTag) once it succeeded. */
  tags?: TagResolver<z.output<S>, T>;
}

function toObject(input: unknown): unknown {
  return input instanceof FormData
    ? Object.fromEntries(input.entries())
    : input;
}

async function run<S extends z.ZodType, T>(
  name: string,
  requireAdmin: boolean,
  schema: S,
  input: ActionInput<S>,
  options: ActionOptions<S, T>,
  handler: (data: z.output<S>, admin: AdminUser | null) => Promise<T>,
): Promise<ActionResult<T>> {
  const requestId = newRequestId();
  const started = Date.now();
  try {
    const admin = requireAdmin ? await getAdmin() : null;
    if (requireAdmin && !admin) {
      logger.warn("action.unauthorized", { action: name, requestId });
      return {
        ok: false,
        error: "Your session has ended. Sign in again.",
        requestId,
      };
    }
    const parsed = schema.safeParse(toObject(input));
    if (!parsed.success) {
      return {
        ok: false,
        error: "Check the highlighted fields.",
        fieldErrors: toFieldErrors(parsed.error),
        requestId,
      };
    }
    const data = await handler(parsed.data, admin);
    if (options.tags) updateTags(options.tags(parsed.data, data));
    logger.info("action.ok", {
      action: name,
      actorId: admin?.id,
      requestId,
      ms: Date.now() - started,
    });
    return { ok: true, data };
  } catch (error) {
    const failure = normalizeError(error, { requestId, name });
    return {
      ok: false,
      error: failure.message,
      fieldErrors: failure.fieldErrors,
      requestId,
    };
  }
}

/** Mutation that needs a signed-in admin. */
export function adminAction<S extends z.ZodType, T = undefined>(
  name: string,
  schema: S,
  handler: (data: z.output<S>, admin: AdminUser) => Promise<T>,
  options: ActionOptions<S, T> = {},
): ActionFn<S, T> {
  return (_prev, input) =>
    run(name, true, schema, input, options, (data, admin) => {
      if (!admin) throw new Error("unreachable: admin checked above");
      return handler(data, admin);
    });
}

/** Action that runs before there is a session (sign-in). */
export function publicAction<S extends z.ZodType, T = undefined>(
  name: string,
  schema: S,
  handler: (data: z.output<S>) => Promise<T>,
  options: ActionOptions<S, T> = {},
): ActionFn<S, T> {
  return (_prev, input) =>
    run(name, false, schema, input, options, (data) => handler(data));
}
