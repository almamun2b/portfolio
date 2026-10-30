import { Suspense, type ReactNode } from "react";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { AdminFrameSkeleton } from "@/components/admin/skeletons";

// Static shell for every signed-in admin page: the skeleton is prerendered,
// the session-dependent frame streams in behind it.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminFrameSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
