"use client";

import { Menu } from "lucide-react";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { IconButton } from "@/components/ui/button";
import { Breadcrumbs, BreadcrumbsFallback } from "./breadcrumbs";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="bg-header sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border px-4 backdrop-blur-xl sm:px-6">
      <IconButton
        label="Open navigation"
        variant="outline"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMenu}
      >
        <Menu aria-hidden="true" />
      </IconButton>
      <div className="min-w-0 flex-1">
        {/* usePathname suspends under /admin/users/[id] (a param unknown at
            build time), so the fallback is the bare "Admin" crumb. */}
        <Suspense fallback={<BreadcrumbsFallback />}>
          <Breadcrumbs />
        </Suspense>
      </div>
      <ThemeToggle />
    </header>
  );
}
