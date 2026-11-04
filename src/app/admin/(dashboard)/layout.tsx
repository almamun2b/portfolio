import { Suspense, type ReactNode } from "react";
import { AdminFrame } from "@/components/admin/admin-frame";
import { UserMenuSkeleton } from "@/components/admin/skeletons";
import { SIDEBAR_INIT_SCRIPT } from "@/components/admin/sidebar-init";
import { UserMenuSlot } from "@/components/admin/user-menu-slot";

// The frame is prerendered: the sidebar and top bar hold no request data, and
// the remembered collapsed state is applied by the inline script before first
// paint. Only the signed-in user block streams (behind its own Suspense).
// This layout doesn't check the session: it doesn't re-render on client
// navigation anyway, so every page and service calls requireAdmin() itself
// and proxy.ts redirects signed-out visitors.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SIDEBAR_INIT_SCRIPT }} />
      <AdminFrame
        userMenu={
          <Suspense fallback={<UserMenuSkeleton />}>
            <UserMenuSlot />
          </Suspense>
        }
      >
        {children}
      </AdminFrame>
    </>
  );
}
