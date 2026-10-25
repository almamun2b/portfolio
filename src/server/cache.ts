import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";

// The only module that touches Next's data-cache APIs. DAL reads go through
// cached(); Server Actions invalidate through expireNow()/refreshSoon().
// Moving to `"use cache"` + cacheTag later changes only this file.

/** Cache tags. Add the module's tags here so invalidation stays greppable. */
export const tags = {
  users: "users",
  user: (id: string) => `user:${id}`,
  sessions: (userId: string) => `sessions:${userId}`,
  audit: "audit",
  dashboard: "dashboard",
} as const;

const SECOND = 1;
export const revalidateAfter = {
  /** Lists and stats: tags drive freshness, this is only a safety net. */
  default: 5 * 60 * SECOND,
  /** Rarely-changing data. */
  long: 60 * 60 * SECOND,
} as const;

interface CacheOptions {
  tags: string[];
  revalidate?: number | false;
}

/**
 * Runs `fn` through the tagged data cache. `keyParts` must contain every
 * input that changes the result (module, function name, serialised params).
 * `fn` must not read cookies()/headers(): authorize before calling this and
 * pass what it needs as arguments.
 */
export function cached<R>(
  keyParts: string[],
  options: CacheOptions,
  fn: () => Promise<R>,
): Promise<R> {
  return unstable_cache(fn, keyParts, {
    tags: options.tags,
    revalidate: options.revalidate ?? revalidateAfter.default,
  })();
}

/** After a mutation: the next read must see the change (no stale response). */
export function expireNow(...names: string[]): void {
  for (const name of names) revalidateTag(name, { expire: 0 });
}

/** Background changes (last sign-in time): stale-while-revalidate is fine. */
export function refreshSoon(...names: string[]): void {
  for (const name of names) revalidateTag(name, "max");
}
