import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/core/db";
import { logger } from "@/server/core/logger";
import { getClientIp, getUserAgent } from "@/server/core/request-context";

export interface AuditEvent {
  actorId?: string | null;
  /** `area.verb`, e.g. "user.create", "auth.signin.failed". */
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

type AuditClient = Pick<typeof db, "auditLog">;

/**
 * Appends an audit row. Pass a transaction client to make the row part of the
 * same commit as the change it records. Failures are logged, never thrown, so
 * a broken audit table can't lock admins out of sign-in.
 */
export async function writeAudit(
  event: AuditEvent,
  client: AuditClient = db,
): Promise<void> {
  try {
    const [ip, userAgent] = await Promise.all([getClientIp(), getUserAgent()]);
    await client.auditLog.create({
      data: {
        actorId: event.actorId ?? null,
        action: event.action,
        targetType: event.targetType ?? null,
        targetId: event.targetId ?? null,
        ip,
        userAgent,
        metadata: (event.metadata ?? undefined) as
          Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    logger.error("audit.write_failed", error, { action: event.action });
  }
}
