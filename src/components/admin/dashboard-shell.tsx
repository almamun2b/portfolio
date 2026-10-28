import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { AdminFrame } from "./admin-frame";
import { ADMIN_COOKIE } from "./nav-config";

/**
 * The signed-in part of the frame. It reads the session and the sidebar
 * cookie (request data), so the layout renders it behind a <Suspense> whose
 * fallback is the frame skeleton. A layout doesn't re-render on client
 * navigation, so this is a convenience check: every page and service calls
 * requireAdmin() itself (once per request, thanks to React cache()).
 */
export async function DashboardShell({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  const collapsed = (await cookies()).get(ADMIN_COOKIE)?.value === "collapsed";
  return (
    <AdminFrame
      user={{ name: admin.name, email: admin.email }}
      defaultCollapsed={collapsed}
    >
      {children}
    </AdminFrame>
  );
}
