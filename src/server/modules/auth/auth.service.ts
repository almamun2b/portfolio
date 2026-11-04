import "server-only";
import { signInSchema } from "@/lib/schemas/auth";
import { writeAudit } from "@/server/core/audit";
import { consume, minutes, peek, reset } from "@/server/core/rate-limit";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import { logger } from "@/server/core/logger";
import { verifyDummy, verifyPassword } from "@/server/core/password";
import { getClientIp } from "@/server/core/request-context";

const WINDOW_MS = 15 * 60 * 1000;
const PER_IDENTITY = 5;
const PER_IP = 30;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN";
}

async function keys(email: string) {
  const ip = await getClientIp();
  return { ipKey: `signin:ip:${ip}`, idKey: `signin:id:${ip}:${email}` };
}

/**
 * Friendly pre-check for the sign-in form. It doesn't count an attempt; the
 * enforcing check is in verifyCredentials(), which also guards the raw
 * /api/auth endpoint.
 */
export async function assertSignInAllowed(email: string): Promise<void> {
  const { ipKey, idKey } = await keys(email.trim().toLowerCase());
  const [byIp, byId] = await Promise.all([
    peek(ipKey, PER_IP),
    peek(idKey, PER_IDENTITY),
  ]);
  const blocked = [byIp, byId].find((r) => !r.allowed);
  if (blocked) {
    throw AppError.rateLimited(
      `Too many sign-in attempts. Try again in about ${String(minutes(blocked.retryAfterSec))} minutes.`,
    );
  }
}

/**
 * The Credentials `authorize` implementation. Returns null for every failure
 * (unknown email, wrong password, disabled account, rate limited) so callers
 * can't tell them apart; the audit log records the real reason.
 */
export async function verifyCredentials(
  raw: unknown,
): Promise<AuthUser | null> {
  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) return null;
  const { email, password } = parsed.data;
  const { ipKey, idKey } = await keys(email);

  const [byIp, byId] = await Promise.all([
    consume(ipKey, PER_IP, WINDOW_MS),
    consume(idKey, PER_IDENTITY, WINDOW_MS),
  ]);
  if (!byIp.allowed || !byId.allowed) {
    logger.warn("auth.signin.rate_limited", { email });
    await writeAudit({ action: "auth.signin.blocked", metadata: { email } });
    await verifyDummy(password);
    return null;
  }

  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      passwordHash: true,
    },
  });

  let valid = false;
  if (user?.passwordHash)
    valid = await verifyPassword(user.passwordHash, password);
  else await verifyDummy(password);

  if (!user || !valid || user.status !== "ACTIVE") {
    const reason = !user
      ? "unknown_user"
      : !valid
        ? "bad_password"
        : "disabled";
    logger.warn("auth.signin.failed", { reason });
    await writeAudit({
      actorId: user?.id ?? null,
      action: "auth.signin.failed",
      targetType: user ? "user" : undefined,
      targetId: user?.id,
      metadata: { email, reason },
    });
    return null;
  }

  await reset(idKey);
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
