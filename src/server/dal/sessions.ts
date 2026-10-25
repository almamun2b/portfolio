import "server-only";
import { SESSION_IDLE_MS } from "@/lib/auth/session-policy";
import type { SessionDTO } from "@/lib/dto";
import { writeAudit } from "@/server/audit";
import { cached, expireNow, tags } from "@/server/cache";
import { assertAdmin, getSession, requireAdmin } from "@/server/dal/auth";
import { db } from "@/server/db";
import { DomainError } from "@/server/errors";

/** Active (not revoked, not expired) sessions of one user. */
export async function listUserSessions(userId: string): Promise<SessionDTO[]> {
  await requireAdmin();
  const currentId = (await getSession())?.sessionId;
  const rows = await cached(
    ["sessions", "byUser", userId],
    { tags: [tags.sessions(userId)] },
    async () => {
      const found = await db.session.findMany({
        where: {
          userId,
          revokedAt: null,
          expiresAt: { gt: new Date() },
          lastSeenAt: { gt: new Date(Date.now() - SESSION_IDLE_MS) },
        },
        select: {
          id: true,
          ip: true,
          userAgent: true,
          createdAt: true,
          lastSeenAt: true,
          expiresAt: true,
        },
        orderBy: { lastSeenAt: "desc" },
        take: 50,
      });
      return found.map((r) => ({
        id: r.id,
        ip: r.ip,
        userAgent: r.userAgent,
        createdAt: r.createdAt.toISOString(),
        lastSeenAt: r.lastSeenAt.toISOString(),
        expiresAt: r.expiresAt.toISOString(),
      }));
    },
  );
  return rows.map((r) => ({ ...r, current: r.id === currentId }));
}

export async function revokeSession(sessionId: string): Promise<void> {
  const actor = await assertAdmin();
  const row = await db.session.findUnique({
    where: { id: sessionId },
    select: { id: true, userId: true, revokedAt: true },
  });
  if (!row)
    throw new DomainError("NOT_FOUND", "That session no longer exists.");
  if ((await getSession())?.sessionId === sessionId) {
    throw new DomainError(
      "CONFLICT",
      "That's this device. Use Sign out instead.",
    );
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
  expireNow(tags.sessions(row.userId), tags.dashboard, tags.audit);
}

/** Signs a user out on every device. For your own account the current device stays. */
export async function revokeAllSessions(userId: string): Promise<number> {
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
  expireNow(tags.sessions(userId), tags.dashboard, tags.audit);
  return result.count;
}
