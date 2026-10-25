import "server-only";
import { writeAudit } from "@/server/audit";
import { expireNow, tags } from "@/server/cache";
import { assertAdmin } from "@/server/dal/auth";
import { consume, minutes } from "@/server/dal/rate-limit";
import { db } from "@/server/db";
import { DomainError } from "@/server/errors";
import { hashPassword, verifyPassword } from "@/server/password";

/** An admin sets another user's password; that user is signed out everywhere. */
export async function setUserPassword(
  id: string,
  password: string,
): Promise<void> {
  const actor = await assertAdmin();
  if (id === actor.id) {
    throw new DomainError(
      "CONFLICT",
      "Change your own password from your account page.",
    );
  }
  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!target)
    throw new DomainError("NOT_FOUND", "That user no longer exists.");
  const passwordHash = await hashPassword(password);
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data: { passwordHash, passwordChangedAt: new Date() },
    });
    await tx.session.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await writeAudit(
      {
        actorId: actor.id,
        action: "user.password.reset",
        targetType: "user",
        targetId: id,
        metadata: { email: target.email },
      },
      tx,
    );
  });
  expireNow(
    tags.user(id),
    tags.users,
    tags.sessions(id),
    tags.dashboard,
    tags.audit,
  );
}

/** Own password: needs the current one; other devices are signed out. */
export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string,
  currentSessionId: string,
): Promise<void> {
  const actor = await assertAdmin();
  const limit = await consume(`pwchange:${actor.id}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    throw new DomainError(
      "RATE_LIMITED",
      `Too many attempts. Try again in about ${String(minutes(limit.retryAfterSec))} minutes.`,
    );
  }
  const row = await db.user.findUnique({
    where: { id: actor.id },
    select: { passwordHash: true },
  });
  const ok = row?.passwordHash
    ? await verifyPassword(row.passwordHash, currentPassword)
    : false;
  if (!ok) {
    await writeAudit({
      actorId: actor.id,
      action: "auth.password.change_failed",
      targetType: "user",
      targetId: actor.id,
    });
    throw new DomainError("INVALID", "Your current password is incorrect.", {
      currentPassword: ["Your current password is incorrect."],
    });
  }
  const passwordHash = await hashPassword(newPassword);
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: actor.id },
      data: { passwordHash, passwordChangedAt: new Date() },
    });
    await tx.session.updateMany({
      where: {
        userId: actor.id,
        revokedAt: null,
        id: { not: currentSessionId },
      },
      data: { revokedAt: new Date() },
    });
    await writeAudit(
      {
        actorId: actor.id,
        action: "auth.password.change",
        targetType: "user",
        targetId: actor.id,
      },
      tx,
    );
  });
  expireNow(tags.user(actor.id), tags.sessions(actor.id), tags.audit);
}
