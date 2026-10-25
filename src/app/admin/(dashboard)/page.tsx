import {
  ArrowUpRight,
  Activity,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { AuditList } from "@/components/admin/audit-list";
import { NAV_ITEMS } from "@/components/admin/nav-config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { auditListParamsSchema } from "@/lib/schemas/audit";
import { listAuditLogs } from "@/server/dal/audit";
import { requireAdmin } from "@/server/dal/auth";
import { getDashboardStats } from "@/server/dal/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    listAuditLogs({ ...auditListParamsSchema.parse({}), perPage: 6 }),
  ]);
  const modules = NAV_ITEMS.filter((item) => item.href !== "/admin");

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${admin.name?.split(" ")[0] ?? "admin"}`}
        description="A quick look at accounts, sessions, and recent activity."
      />

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Activity
                aria-hidden="true"
                className="size-[1.1rem] text-primary-strong"
              />
              Recent activity
            </CardTitle>
            <Link
              href="/admin/audit-log"
              className="rounded-md text-sm text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <AuditList items={activity.items} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {modules.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href as Route}
                    className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="size-[1.1rem] shrink-0 text-primary-strong"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    {item.status === "soon" ? (
                      <Badge variant="outline">Soon</Badge>
                    ) : (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
