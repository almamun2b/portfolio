import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { SESSION_IDLE_MS } from "@/lib/auth/session-policy";
import type { SessionDTO } from "@/lib/dto";
import { writeAudit } from "@/server/core/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import {
  assertAdmin,
  getSession,
  requireAdmin,
} from "@/server/modules/auth/auth.guard";
import { sessionSelect, toSessionDTO } from "./sessions.model";

async function listActiveSessionsCached(userId: string) {
  "use cache";
  cacheTag(CACHE_TAGS.sessions(userId));
  cacheLife("admin");
  const now = Date.now();
  const rows = await db.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date(now) },
      lastSeenAt: { gt: new Date(now - SESSION_IDLE_MS) },
    },
    select: sessionSelect,
    orderBy: { lastSeenAt: "desc" },
    take: 50,
  });
  return rows.map(toSessionDTO);
}

/** Active (not revoked, not expired) sessions of one user. */
export async function listUserSessions(userId: string): Promise<SessionDTO[]> {
  await requireAdmin();
  const currentId = (await getSession())?.sessionId;
  const rows = await listActiveSessionsCached(userId);
  return rows.map((r) => ({ ...r, current: r.id === currentId }));
}

export async function revokeSession(
  sessionId: string,
): Promise<{ userId: string }> {
  const actor = await assertAdmin();
  const row = await db.session.findUnique({
    where: { id: sessionId },
    select: { id: true, userId: true, revokedAt: true },
  });
  if (!row) throw AppError.notFound("That session no longer exists.");
  if ((await getSession())?.sessionId === sessionId) {
    throw AppError.conflict("That's this device. Use Sign out instead.");
  }
  if (!row.revokedAt) {
    await db.session.update({
      where: { id: row.id },
      data: { revokedAt: new Date() },
    });
  }
  await writeAudit({
    actorId: actor.id,
    action: "session.revoke",
    targetType: "user",
    targetId: row.userId,
    metadata: { sessionId },
  });
  return { userId: row.userId };
}

/** Signs a user out on every device. For your own account the current device stays. */
export async function revokeAllSessions(
  userId: string,
): Promise<{ count: number }> {
  const actor = await assertAdmin();
  const keep =
    userId === actor.id ? (await getSession())?.sessionId : undefined;
  const result = await db.session.updateMany({
    where: { userId, revokedAt: null, ...(keep ? { id: { not: keep } } : {}) },
    data: { revokedAt: new Date() },
  });
  await writeAudit({
    actorId: actor.id,
    action: "session.revoke_all",
    targetType: "user",
    targetId: userId,
    metadata: { count: result.count },
  });
  return { count: result.count };
}
