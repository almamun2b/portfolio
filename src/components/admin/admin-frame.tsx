"use client";

import { useState, type ReactNode } from "react";
import { DialogCloseButton, Sheet } from "@/components/ui/dialog";
import { ADMIN_COOKIE } from "./nav-config";
import { AdminBrand } from "./brand";
import { SidebarNav } from "./sidebar-nav";
import { SidebarToggle } from "./sidebar-toggle";
import { Topbar } from "./topbar";
import { UserMenu, type MenuUser } from "./user-menu";

/**
 * The dashboard shell: fixed sidebar (collapsible from `lg`, toggle on top,
 * account menu at the bottom), a drawer on phones and tablets, a sticky top
 * bar, and the page. The collapsed choice is remembered in a cookie that the
 * layout reads, so the first paint is right.
 */
export function AdminFrame({
  user,
  defaultCollapsed,
  children,
}: {
  user: MenuUser;
  defaultCollapsed: boolean;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${ADMIN_COOKIE}=${next ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`;
  }

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-gradient-button px-5 py-3 text-sm font-semibold text-primary-foreground shadow-button transition-transform focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Skip to content
      </a>

      <aside
        id="admin-sidebar"
        data-collapsed={collapsed}
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card-solid transition-[width] duration-300 ease-out-expo data-[collapsed=true]:w-[4.5rem] lg:flex"
      >
        <AdminBrand collapsed={collapsed} />
        <SidebarToggle collapsed={collapsed} onToggle={toggle} />
        <div className="flex-1">
          <SidebarNav collapsed={collapsed} />
        </div>
        <div className="border-t border-border p-3">
          <UserMenu user={user} collapsed={collapsed} />
        </div>
      </aside>

      <Sheet
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Navigation"
        side="left"
        hideHeader
      >
        <div className="relative flex min-h-full flex-col">
          <DialogCloseButton
            label="Close navigation"
            className="absolute top-3.5 right-3 size-9"
            onClose={() => {
              setDrawerOpen(false);
            }}
          />
          <AdminBrand />
          <div className="flex-1">
            <SidebarNav
              onNavigate={() => {
                setDrawerOpen(false);
              }}
            />
          </div>
          <div className="border-t border-border p-3">
            <UserMenu user={user} />
          </div>
        </div>
      </Sheet>

      <div
        data-collapsed={collapsed}
        className="flex min-h-dvh flex-col transition-[padding] duration-300 ease-out-expo lg:pl-64 data-[collapsed=true]:lg:pl-[4.5rem]"
      >
        <Topbar
          onOpenMenu={() => {
            setDrawerOpen(true);
          }}
        />
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 outline-none sm:px-6 sm:py-8 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
