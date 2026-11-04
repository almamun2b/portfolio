import "server-only";
import { db } from "@/server/core/db";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

/**
 * Fixed-window counter in Postgres (one atomic upsert), so limits hold across
 * serverless instances. Counts this call, then reports whether it is within
 * `limit` for the current window.
 */
export async function consume(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  const rows = await db.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."resetAt" <= ${now} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" <= ${now} THEN ${resetAt} ELSE "RateLimit"."resetAt" END
    RETURNING "count"::int AS "count", "resetAt"`;
  const row = rows[0];
  if (Math.random() < 0.02) {
    // Housekeeping without a cron job.
    await db.rateLimit.deleteMany({ where: { resetAt: { lt: now } } });
  }
  if (!row) return { allowed: true, retryAfterSec: 0 };
  return {
    allowed: row.count <= limit,
    retryAfterSec: Math.max(
      1,
      Math.ceil((row.resetAt.getTime() - now.getTime()) / 1000),
    ),
  };
}

/** Read-only check, used to show a friendly message before spending an attempt. */
export async function peek(
  key: string,
  limit: number,
): Promise<RateLimitResult> {
  const row = await db.rateLimit.findUnique({ where: { key } });
  const now = Date.now();
  if (!row || row.resetAt.getTime() <= now) {
    return { allowed: true, retryAfterSec: 0 };
  }
  return {
    allowed: row.count < limit,
    retryAfterSec: Math.max(1, Math.ceil((row.resetAt.getTime() - now) / 1000)),
  };
}

export async function reset(key: string): Promise<void> {
  await db.rateLimit.deleteMany({ where: { key } });
}

export function minutes(retryAfterSec: number): number {
  return Math.max(1, Math.ceil(retryAfterSec / 60));
}
