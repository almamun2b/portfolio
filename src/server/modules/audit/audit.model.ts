import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { AuditLogDTO } from "@/lib/dto";

export const auditSelect = {
  id: true,
  action: true,
  targetType: true,
  targetId: true,
  ip: true,
  metadata: true,
  createdAt: true,
  actor: { select: { id: true, name: true, email: true } },
} satisfies Prisma.AuditLogSelect;

type AuditRow = Prisma.AuditLogGetPayload<{ select: typeof auditSelect }>;

export function toAuditDTO(row: AuditRow): AuditLogDTO {
  const metadata =
    row.metadata &&
    typeof row.metadata === "object" &&
    !Array.isArray(row.metadata)
      ? (row.metadata as Record<string, unknown>)
      : null;
  return {
    id: row.id,
    action: row.action,
    actor: row.actor,
    targetType: row.targetType,
    targetId: row.targetId,
    ip: row.ip,
    metadata,
    createdAt: row.createdAt.toISOString(),
  };
}
