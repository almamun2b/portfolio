"use client";

import { useState, type ReactNode } from "react";
import { DialogCloseButton, Sheet } from "@/components/ui/dialog";
import { AdminBrand } from "./brand";
import { SidebarNav } from "./sidebar-nav";
import { SidebarToggle } from "./sidebar-toggle";
import { Topbar } from "./topbar";

/**
 * The dashboard shell: fixed sidebar (collapsible from `lg`, the handle at its
 * top and the signed-in user at its bottom), a drawer on phones and tablets, a
 * sticky top bar, and the page. It holds no request data, so it is prerendered:
 * the collapsed choice is an attribute on <html> (see sidebar-state.ts) and
 * `userMenu` is the streamed user block the layout passes in.
 */
export function AdminFrame({
  userMenu,
  children,
}: {
  userMenu: ReactNode;
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card-solid transition-[width] duration-300 ease-out-expo lg:flex rail:w-[4.5rem]"
      >
        <AdminBrand />
        <SidebarToggle />
        <div className="flex-1">
          <SidebarNav />
        </div>
        {userMenu}
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
          {userMenu}
        </div>
      </Sheet>

      <div className="flex min-h-dvh flex-col transition-[padding] duration-300 ease-out-expo lg:pl-64 lg:rail:pl-[4.5rem]">
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
