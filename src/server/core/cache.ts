import "server-only";
import { revalidateTag, updateTag } from "next/cache";

// Cache tags and the three ways to invalidate them. Reads are cached with
// `"use cache"` + `cacheTag(...)` inside the module services; this file is
// the only place that knows how a mutation expires those tags.

export const CACHE_TAGS = {
  USERS: "users",
  AUDIT: "audit",
  DASHBOARD: "dashboard",
  user: (id: string) => `user:${id}`,
  sessions: (userId: string) => `sessions:${userId}`,
} as const;

/**
 * Which tags a mutation expires, resolved from its parsed input (and, when
 * the target is only known afterwards, the service's result). Each module
 * declares one map (`userTags`) and both the Server Action and the Route
 * Handler for a mutation reference the same entry, so they can't drift.
 */
export type TagResolver<I, R = never> = (
  input: I,
  result: R,
) => readonly string[];
export type MutationTags = Record<string, TagResolver<never>>;

/**
 * Server Action: read-your-own-writes. The next render waits for fresh data,
 * and the action's response already carries it. `updateTag` throws outside a
 * Server Action, so only the action wrapper calls this.
 */
export function updateTags(tags: readonly string[]): void {
  for (const tag of new Set(tags)) updateTag(tag);
}

/** Route Handlers and other server code: same "no stale data" result as updateTag. */
export function expireTags(tags: readonly string[]): void {
  for (const tag of new Set(tags)) revalidateTag(tag, { expire: 0 });
}

/** Background changes nobody waits on (last sign-in time): stale-while-revalidate. */
export function refreshTags(tags: readonly string[]): void {
  for (const tag of new Set(tags)) revalidateTag(tag, "max");
}
