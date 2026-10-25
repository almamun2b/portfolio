// Session lifetimes. The JWT cookie is only a pointer to a Session row; the
// row decides whether it is still valid.
export const SESSION_ABSOLUTE_MS = 12 * 60 * 60 * 1000; // sign in again after 12 h
export const SESSION_IDLE_MS = 60 * 60 * 1000; // ... or after 60 min of inactivity
export const SESSION_TOUCH_MS = 5 * 60 * 1000; // lastSeenAt write throttle

export interface SessionRow {
  expiresAt: Date;
  lastSeenAt: Date;
  revokedAt: Date | null;
}

export type SessionVerdict = "valid" | "revoked" | "expired" | "idle";

export function judgeSession(
  row: SessionRow,
  now = new Date(),
): SessionVerdict {
  if (row.revokedAt) return "revoked";
  if (row.expiresAt.getTime() <= now.getTime()) return "expired";
  if (now.getTime() - row.lastSeenAt.getTime() > SESSION_IDLE_MS) return "idle";
  return "valid";
}

export function needsTouch(row: SessionRow, now = new Date()): boolean {
  return now.getTime() - row.lastSeenAt.getTime() > SESSION_TOUCH_MS;
}
