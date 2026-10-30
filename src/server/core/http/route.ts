import "server-only";
import type { NextRequest } from "next/server";
import type { z } from "zod";
import type { PaginationMeta } from "@/lib/dto";
import { expireTags } from "@/server/core/cache";
import { AppError } from "@/server/core/errors/app-error";
import { normalizeError } from "@/server/core/errors/normalize";
import { toFieldErrors } from "@/server/core/errors/zod-error";
import { logger, newRequestId } from "@/server/core/logger";
import {
  getAdmin,
  getSession,
  type AdminUser,
} from "@/server/modules/auth/auth.guard";
import { fail, ok } from "./response";

// The controller wrapper: authenticate, CSRF-check, parse params/query/body
// with Zod, run the service, expire the mutation's tags, and answer in the
// starter's envelope. Route Handlers are public endpoints, so every one goes
// through here; errors leave through normalizeError like Server Actions do.

type Params = Record<string, string | string[] | undefined>;
export interface RouteContext {
  params: Promise<Params>;
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

interface Parts<P, Q, B> {
  params: P;
  query: Q;
  body: B;
}

interface Config<
  T,
  P extends z.ZodType,
  Q extends z.ZodType,
  B extends z.ZodType,
> {
  /** Used in logs, e.g. "users.create". */
  name: string;
  /** "admin" needs a signed-in admin; "public" needs nothing. */
  auth: "admin" | "public";
  params?: P;
  query?: Q;
  body?: B;
  /** Success status; 201 for creates. */
  status?: number;
  message?: string;
  /** Tags to expire after a successful mutation. */
  tags?: (
    input: Parts<z.output<P>, z.output<Q>, z.output<B>>,
    result: T,
  ) => readonly string[];
}

interface Ctx<P, Q, B> extends Parts<P, Q, B> {
  admin: AdminUser | null;
  req: NextRequest;
}

function isPaginated(value: unknown): value is {
  data: unknown;
  meta: PaginationMeta;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "meta" in value &&
    typeof (value as { meta: { totalPage?: unknown } }).meta.totalPage ===
      "number"
  );
}

/** Cookie-authenticated writes must come from this site (CSRF defence in depth). */
function assertSameOrigin(req: NextRequest): void {
  if (SAFE_METHODS.has(req.method)) return;
  const origin = req.headers.get("origin");
  const site = req.headers.get("sec-fetch-site");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const crossSite = site === "cross-site";
  const foreign = origin !== null && new URL(origin).host !== host;
  if (crossSite || foreign)
    throw AppError.forbidden("Cross-site request blocked.");
}

async function readBody(req: NextRequest): Promise<unknown> {
  if (SAFE_METHODS.has(req.method)) return undefined;
  try {
    return (await req.json()) as unknown;
  } catch {
    throw AppError.badRequest("The request body must be valid JSON.");
  }
}

function parse<S extends z.ZodType>(schema: S | undefined, value: unknown) {
  if (!schema) return undefined as z.output<S>;
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw AppError.validation(
      "Check the highlighted fields.",
      toFieldErrors(parsed.error),
    );
  }
  return parsed.data;
}

async function authenticate(
  required: "admin" | "public",
): Promise<AdminUser | null> {
  if (required === "public") return null;
  const admin = await getAdmin();
  if (admin) return admin;
  // A signed-in non-admin must not learn the API exists.
  if (await getSession()) throw AppError.notFound("Not found.");
  throw AppError.unauthorized();
}

export function apiRoute<
  T,
  P extends z.ZodType = z.ZodType<undefined>,
  Q extends z.ZodType = z.ZodType<undefined>,
  B extends z.ZodType = z.ZodType<undefined>,
>(
  config: Config<T, P, Q, B>,
  handler: (ctx: Ctx<z.output<P>, z.output<Q>, z.output<B>>) => Promise<T>,
) {
  return async (req: NextRequest, context: RouteContext): Promise<Response> => {
    const requestId = newRequestId();
    const started = Date.now();
    try {
      assertSameOrigin(req);
      const admin = await authenticate(config.auth);
      const input: Parts<z.output<P>, z.output<Q>, z.output<B>> = {
        params: parse(config.params, await context.params),
        query: parse(
          config.query,
          Object.fromEntries(req.nextUrl.searchParams),
        ),
        body: parse(config.body, config.body ? await readBody(req) : undefined),
      };
      const result = await handler({ ...input, admin, req });
      if (config.tags) expireTags(config.tags(input, result));
      logger.info("route.ok", {
        route: config.name,
        actorId: admin?.id,
        requestId,
        ms: Date.now() - started,
      });
      const options = { status: config.status, message: config.message };
      return isPaginated(result)
        ? ok(req, result.data, { ...options, meta: result.meta })
        : ok(req, result, options);
    } catch (error) {
      return fail(req, normalizeError(error, { requestId, name: config.name }));
    }
  };
}
