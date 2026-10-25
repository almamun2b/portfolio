import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AdminFrame } from "@/components/admin/admin-frame";
import { ADMIN_COOKIE } from "@/components/admin/nav-config";
import { requireAdmin } from "@/server/dal/auth";

// Shell for every signed-in admin page. A layout doesn't re-render on
// client navigation, so this is a convenience check: every page and DAL
// function calls requireAdmin() itself.
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
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
