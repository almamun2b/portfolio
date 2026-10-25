import "server-only";
import { SESSION_IDLE_MS } from "@/lib/auth/session-policy";
import type { DashboardStatsDTO } from "@/lib/dto";
import { cached, tags } from "@/server/cache";
import { requireAdmin } from "@/server/dal/auth";
import { db } from "@/server/db";

export async function getDashboardStats(): Promise<DashboardStatsDTO> {
  await requireAdmin();
  return cached(
    ["dashboard", "stats"],
    { tags: [tags.dashboard] },
    async () => {
      const [totalUsers, activeUsers, disabledUsers, activeSessions] =
        await Promise.all([
          db.user.count(),
          db.user.count({ where: { status: "ACTIVE" } }),
          db.user.count({ where: { status: "DISABLED" } }),
          db.session.count({
            where: {
              revokedAt: null,
              expiresAt: { gt: new Date() },
              lastSeenAt: { gt: new Date(Date.now() - SESSION_IDLE_MS) },
            },
          }),
        ]);
      return { totalUsers, activeUsers, disabledUsers, activeSessions };
    },
  );
}
