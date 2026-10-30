import "server-only";
import { writeAudit } from "@/server/core/audit";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import { hashPassword, verifyPassword } from "@/server/core/password";
import { consume, minutes } from "@/server/core/rate-limit";
import { assertAdmin } from "@/server/modules/auth/auth.guard";

/** Own password: needs the current one; other devices are signed out. */
export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string,
  currentSessionId: string,
): Promise<{ userId: string }> {
  const actor = await assertAdmin();
  const limit = await consume(`pwchange:${actor.id}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    throw AppError.rateLimited(
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
    throw AppError.validation("Your current password is incorrect.", {
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
  return { userId: actor.id };
}
