import "server-only";
import { unstable_rethrow } from "next/navigation";
import type { z } from "zod";
import type { ActionResult, FieldErrors } from "@/lib/action-result";
import { getAdmin, type AdminUser } from "@/server/dal/auth";
import { DomainError } from "@/server/errors";
import { logger, newRequestId } from "@/server/logger";

// Every Server Action goes through one of these wrappers, which do the same
// five things in the same order: authenticate/authorize, parse with Zod, run,
// log, and return a typed result. Server Actions are public endpoints, so
// none of that is optional. Action files add "use server" and export the
// wrapped function; they never throw to the client.

export type ActionInput<S extends z.ZodType> = FormData | z.input<S>;

export type ActionFn<S extends z.ZodType, T> = (
  prevState: unknown,
  input: ActionInput<S>,
) => Promise<ActionResult<T>>;

function toObject(input: unknown): unknown {
  return input instanceof FormData
    ? Object.fromEntries(input.entries())
    : input;
}

function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

interface Options {
  name: string;
  requireAdmin: boolean;
}

async function run<S extends z.ZodType, T>(
  options: Options,
  schema: S,
  input: ActionInput<S>,
  handler: (data: z.output<S>, admin: AdminUser | null) => Promise<T>,
): Promise<ActionResult<T>> {
  const requestId = newRequestId();
  const started = Date.now();
  try {
    const admin = options.requireAdmin ? await getAdmin() : null;
    if (options.requireAdmin && !admin) {
      logger.warn("action.unauthorized", { action: options.name, requestId });
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
    logger.info("action.ok", {
      action: options.name,
      actorId: admin?.id,
      requestId,
      ms: Date.now() - started,
    });
    return { ok: true, data };
  } catch (error) {
    unstable_rethrow(error); // redirect() and notFound() must keep flowing
    if (error instanceof DomainError) {
      logger.warn("action.rejected", {
        action: options.name,
        code: error.code,
        requestId,
      });
      return {
        ok: false,
        error: error.message,
        fieldErrors: error.fieldErrors,
        requestId,
      };
    }
    logger.error("action.failed", error, { action: options.name, requestId });
    return {
      ok: false,
      error: `Something went wrong. Try again, and quote reference ${requestId} if it keeps happening.`,
      requestId,
    };
  }
}

/** Mutation that needs a signed-in admin. */
export function adminAction<S extends z.ZodType, T = undefined>(
  name: string,
  schema: S,
  handler: (data: z.output<S>, admin: AdminUser) => Promise<T>,
): ActionFn<S, T> {
  return (_prev, input) =>
    run({ name, requireAdmin: true }, schema, input, (data, admin) => {
      if (!admin)
        throw new DomainError("UNAUTHORIZED", "Your session has ended.");
      return handler(data, admin);
    });
}

/** Action that runs before there is a session (sign-in). */
export function publicAction<S extends z.ZodType, T = undefined>(
  name: string,
  schema: S,
  handler: (data: z.output<S>) => Promise<T>,
): ActionFn<S, T> {
  return (_prev, input) =>
    run({ name, requireAdmin: false }, schema, input, (data) => handler(data));
}
