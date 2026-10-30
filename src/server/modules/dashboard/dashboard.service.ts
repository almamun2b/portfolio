import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { SESSION_IDLE_MS } from "@/lib/auth/session-policy";
import type { DashboardStatsDTO } from "@/lib/dto";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { requireAdmin } from "@/server/modules/auth/auth.guard";

export async function getDashboardStats(): Promise<DashboardStatsDTO> {
  await requireAdmin();
  return getDashboardStatsCached();
}

async function getDashboardStatsCached(): Promise<DashboardStatsDTO> {
  "use cache";
  cacheTag(CACHE_TAGS.DASHBOARD);
  cacheLife("admin");
  const now = Date.now();
  const [totalUsers, activeUsers, disabledUsers, activeSessions] =
    await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: "ACTIVE" } }),
      db.user.count({ where: { status: "DISABLED" } }),
      db.session.count({
        where: {
          revokedAt: null,
          expiresAt: { gt: new Date(now) },
          lastSeenAt: { gt: new Date(now - SESSION_IDLE_MS) },
        },
      }),
    ]);
  return { totalUsers, activeUsers, disabledUsers, activeSessions };
}
