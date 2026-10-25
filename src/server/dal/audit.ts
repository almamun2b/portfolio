import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { AuditLogDTO, Paginated } from "@/lib/dto";
import { paginated } from "@/lib/dto";
import type { AuditListParams } from "@/lib/schemas/audit";
import { cached, tags } from "@/server/cache";
import { requireAdmin } from "@/server/dal/auth";
import { db } from "@/server/db";

type AuditRow = Prisma.AuditLogGetPayload<{
  select: typeof auditSelect;
}>;

const auditSelect = {
  id: true,
  action: true,
  targetType: true,
  targetId: true,
  ip: true,
  metadata: true,
  createdAt: true,
  actor: { select: { id: true, name: true, email: true } },
} satisfies Prisma.AuditLogSelect;

function toDTO(row: AuditRow): AuditLogDTO {
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

export async function listAuditLogs(
  params: AuditListParams,
): Promise<Paginated<AuditLogDTO>> {
  await requireAdmin();
  return cached(
    ["audit", "list", JSON.stringify(params)],
    { tags: [tags.audit] },
    async () => {
      const where: Prisma.AuditLogWhereInput = {
        ...(params.area ? { action: { startsWith: `${params.area}.` } } : {}),
        ...(params.q
          ? {
              OR: [
                { action: { contains: params.q, mode: "insensitive" } },
                {
                  actor: { email: { contains: params.q, mode: "insensitive" } },
                },
              ],
            }
          : {}),
      };
      const [rows, total] = await Promise.all([
        db.auditLog.findMany({
          where,
          select: auditSelect,
          orderBy: [{ createdAt: params.dir }, { id: "asc" }],
          skip: (params.page - 1) * params.perPage,
          take: params.perPage,
        }),
        db.auditLog.count({ where }),
      ]);
      return paginated(rows.map(toDTO), total, params.page, params.perPage);
    },
  );
}

/** Newest entries about one record (a user's detail page). */
export async function listAuditForTarget(
  targetType: string,
  targetId: string,
  limit = 8,
): Promise<AuditLogDTO[]> {
  await requireAdmin();
  return cached(
    ["audit", "target", targetType, targetId, String(limit)],
    { tags: [tags.audit] },
    async () => {
      const rows = await db.auditLog.findMany({
        where: { targetType, targetId },
        select: auditSelect,
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return rows.map(toDTO);
    },
  );
}
