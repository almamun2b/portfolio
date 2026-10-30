"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "cn";
import { Tooltip } from "@/components/ui/tooltip";

/**
 * The collapse handle: a small round button on the sidebar's right edge, in
 * the header row, that looks the same expanded or collapsed (the icon rail has
 * no room for a second header control).
 */
export function SidebarToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar";
  return (
    <div className="absolute top-5 -right-3.5 z-10">
      <Tooltip id="sidebar-toggle-tip" content={label} side="right">
        <button
          type="button"
          onClick={onToggle}
          aria-label={label}
          aria-expanded={!collapsed}
          aria-controls="admin-sidebar"
          className="grid size-7 cursor-pointer place-items-center rounded-full border border-border-strong bg-card-solid text-muted-foreground shadow-card transition-colors hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronLeft
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform duration-300 ease-out-expo",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </Tooltip>
    </div>
  );
}
