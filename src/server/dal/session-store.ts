import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { isAdminRole } from "@/lib/auth/safe-path";
import {
  SESSION_ABSOLUTE_MS,
  judgeSession,
  needsTouch,
} from "@/lib/auth/session-policy";
import { writeAudit } from "@/server/audit";
import { expireNow, refreshSoon, tags } from "@/server/cache";
import { db } from "@/server/db";
import { logger } from "@/server/logger";
import { getClientIp, getUserAgent } from "@/server/request-context";

// Raw session rows, no authorization: used by Auth.js callbacks (src/server/auth.ts)
// where the caller is, by definition, not signed in yet or is mid-validation.
// Admin-facing session management is in dal/sessions.ts.

const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export interface CreatedSession {
  token: string;
  sessionId: string;
}

export async function createSession(userId: string): Promise<CreatedSession> {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const [ip, userAgent] = await Promise.all([getClientIp(), getUserAgent()]);
  const row = await db.session.create({
    data: {
      tokenHash: sha256(token),
      userId,
      expiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS),
      ip,
      userAgent,
    },
    select: { id: true },
  });
  await db.user.update({ where: { id: userId }, data: { lastLoginAt: now } });
  await writeAudit({
    actorId: userId,
    action: "auth.signin",
    targetType: "user",
    targetId: userId,
  });
  // Cached lists that show this user's sessions, last sign-in, and activity
  // must not stay stale for minutes after a sign-in.
  try {
    expireNow(tags.sessions(userId), tags.audit);
    refreshSoon(tags.users, tags.user(userId), tags.dashboard);
  } catch (error) {
    logger.warn("auth.cache_refresh_skipped", { reason: String(error) });
  }
  // Opportunistic cleanup of long-dead rows.
  await db.session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date(now.getTime() - 7 * 86_400_000) } },
        { revokedAt: { lt: new Date(now.getTime() - 7 * 86_400_000) } },
      ],
    },
  });
  return { token, sessionId: row.id };
}

export interface ValidSession {
  sessionId: string;
  userId: string;
}

/** Null when revoked, expired, idle too long, or the user is gone/disabled. */
export async function validateSession(
  token: string,
): Promise<ValidSession | null> {
  const row = await db.session.findUnique({
    where: { tokenHash: sha256(token) },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      lastSeenAt: true,
      revokedAt: true,
      user: { select: { status: true, role: true } },
    },
  });
  if (!row) return null;
  if (row.user.status !== "ACTIVE" || !isAdminRole(row.user.role)) return null;
  if (judgeSession(row) !== "valid") return null;
  if (needsTouch(row)) {
    await db.session.update({
      where: { id: row.id },
      data: { lastSeenAt: new Date() },
    });
  }
  return { sessionId: row.id, userId: row.userId };
}

export async function revokeByToken(token: string): Promise<string | null> {
  const row = await db.session.findUnique({
    where: { tokenHash: sha256(token) },
    select: { id: true, userId: true, revokedAt: true },
  });
  if (!row) return null;
  if (!row.revokedAt) {
    await db.session.update({
      where: { id: row.id },
      data: { revokedAt: new Date() },
    });
  }
  return row.userId;
}
