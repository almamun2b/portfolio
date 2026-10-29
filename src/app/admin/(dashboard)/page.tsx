import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ActivitySkeleton,
  CardGridSkeleton,
} from "@/components/admin/skeletons";
import { WidgetBoundary } from "@/components/admin/widget-boundary";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { ActivityCard } from "./_components/activity-card";
import { ModulesCard } from "./_components/modules-card";
import { StatsSection } from "./_components/stats-section";

export const metadata: Metadata = { title: "Dashboard" };

// Each widget streams in behind its own Suspense and fails on its own, so a
// slow or broken query never holds up or takes down the rest of the page.
export default async function DashboardPage() {
  const admin = await requireAdmin();
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${admin.name?.split(" ")[0] ?? "admin"}`}
        description="A quick look at accounts, sessions, and recent activity."
      />

      <WidgetBoundary title="Key numbers">
        <Suspense fallback={<CardGridSkeleton />}>
          <StatsSection />
        </Suspense>
      </WidgetBoundary>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <WidgetBoundary title="Recent activity">
          <Suspense fallback={<ActivitySkeleton />}>
            <ActivityCard />
          </Suspense>
        </WidgetBoundary>
        <ModulesCard />
      </div>
    </div>
  );
}
