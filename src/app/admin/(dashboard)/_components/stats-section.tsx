import { ShieldCheck, UserCheck, UserX, Users } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { getDashboardStats } from "@/server/modules/dashboard/dashboard.service";

/** Streams in on its own: the numbers come from a tagged, cached read. */
export async function StatsSection() {
  const stats = await getDashboardStats();
  return (
    <section
      aria-label="Key numbers"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <StatCard label="Total users" value={stats.totalUsers} icon={Users} />
      <StatCard
        label="Active users"
        value={stats.activeUsers}
        icon={UserCheck}
      />
      <StatCard
        label="Disabled users"
        value={stats.disabledUsers}
        icon={UserX}
      />
      <StatCard
        label="Active sessions"
        value={stats.activeSessions}
        icon={ShieldCheck}
        hint="Signed in right now"
      />
    </section>
  );
}
