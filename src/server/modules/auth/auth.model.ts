import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";

/**
 * The signed-in user's row, cached per user. The session itself is verified
 * on every request in auth.session.ts (revoked, expired, idle, disabled), so
 * this cache only saves the profile read; a status or role change expires
 * `user:<id>` through the mutation's tag map. Pass the id in as an argument:
 * cached scopes can't read cookies.
 */
export async function readAdminProfile(id: string) {
  "use cache";
  cacheTag(CACHE_TAGS.user(id));
  cacheLife("minutes");
  return db.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, status: true },
  });
}
