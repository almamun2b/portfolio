import type { AuditLogDTO, Paginated } from "@/lib/dto";
import type { AuditListParams } from "@/lib/schemas/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { cacheLife, cacheTag } from "next/cache";
import { QueryBuilder } from "query-builder-prisma";
import "server-only";
import { auditSelect, toAuditDTO, type AuditRow } from "./audit.model";

export async function listAuditLogs(
  params: AuditListParams,
): Promise<Paginated<AuditLogDTO>> {
  await requireAdmin();
  return listAuditLogsCached(params);
}

async function listAuditLogsCached(
  params: AuditListParams,
): Promise<Paginated<AuditLogDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.AUDIT);
  cacheLife("admin");
  const term = params.searchTerm;
  const { data, meta } = await new QueryBuilder(db.auditLog)
    .filter({
      action: params.area ? { startsWith: `${params.area}.` } : undefined,
    })
    // The actor's email lives on a relation, which search() can't reach.
    .where(
      term
        ? {
            OR: [
              { action: { contains: term, mode: "insensitive" } },
              { actor: { email: { contains: term, mode: "insensitive" } } },
            ],
          }
        : {},
    )
    .orderBy([{ createdAt: params.sortOrder }, { id: "asc" }])
    .paginate({ page: params.page, limit: params.limit })
    .select(auditSelect)
    .executeWithMeta();
  return {
    data: data.map((row) => toAuditDTO(row as AuditRow)),
    meta,
  };
}

/** Newest entries about one record (a user's detail page). */
export async function listAuditForTarget(
  targetType: string,
  targetId: string,
  limit = 8,
): Promise<AuditLogDTO[]> {
  await requireAdmin();
  return listAuditForTargetCached(targetType, targetId, limit);
}

async function listAuditForTargetCached(
  targetType: string,
  targetId: string,
  limit: number,
): Promise<AuditLogDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.AUDIT);
  cacheLife("admin");
  const rows = await db.auditLog.findMany({
    where: { targetType, targetId },
    select: auditSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toAuditDTO);
}
