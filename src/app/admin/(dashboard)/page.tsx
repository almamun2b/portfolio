import type { Metadata } from "next";
import { WidgetBoundary } from "@/components/admin/widget-boundary";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { ActivityCard } from "./_components/activity-card";
import { ModulesCard } from "./_components/modules-card";
import { StatsSection } from "./_components/stats-section";

export const metadata: Metadata = { title: "Dashboard" };

// Each widget fails on its own (WidgetBoundary), so a broken query never takes
// down the rest of the page. They are cached reads, so there is no Suspense:
// the page appears once, instead of a skeleton that React holds for 300 ms.
// Blocking on purpose: a click keeps the current page until this one is
// ready (see AGENTS.md › Navigation), so there is no skeleton to validate.
export const instant = false;

export default async function DashboardPage() {
  const admin = await requireAdmin();
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${admin.name?.split(" ")[0] ?? "admin"}`}
        description="A quick look at accounts, sessions, and recent activity."
      />

      <WidgetBoundary title="Key numbers">
        <StatsSection />
      </WidgetBoundary>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <WidgetBoundary title="Recent activity">
          <ActivityCard />
        </WidgetBoundary>
        <ModulesCard />
      </div>
    </div>
  );
}
