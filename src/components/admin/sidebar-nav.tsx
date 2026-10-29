"use client";

import { cn } from "cn";
import Link, { useLinkStatus } from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { NAV_GROUPS, isActive, type NavItem } from "./nav-config";

/**
 * The module list. `collapsed` shrinks it to icons (labels stay in the
 * accessibility tree and a tooltip names each icon). `onNavigate` closes the
 * mobile drawer.
 */
export function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-5 p-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p
            className={cn(
              "px-3 pb-1 text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase transition-opacity duration-200",
              collapsed && "h-0 overflow-hidden pb-0 opacity-0",
            )}
          >
            {group.label}
          </p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  active={isActive(item.href, pathname)}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href as Route}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "relative flex h-11 items-center gap-3 rounded-full px-3.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "bg-muted text-foreground shadow-[inset_0_0_0_1.5px_var(--primary)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-[1.15rem] shrink-0",
          active && "text-primary-strong",
        )}
      />
      <span
        className={cn(
          "flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden whitespace-nowrap transition-[opacity] duration-200",
          collapsed && "w-0 flex-none opacity-0",
        )}
      >
        <span className="truncate">{item.label}</span>
        {item.status === "soon" ? (
          <Badge variant="outline" className="h-5 px-2 text-[0.65rem]">
            Soon
          </Badge>
        ) : null}
      </span>
      <NavPending />
    </Link>
  );
  if (!collapsed) return link;
  return (
    <Tooltip
      id={`nav-tip-${item.label.toLowerCase().replaceAll(" ", "-")}`}
      content={item.label}
      side="right"
    >
      {link}
    </Tooltip>
  );
}

/**
 * Inside a nav link: while that navigation is in flight, show a spinner and
 * set `data-nav-pending`, which <AdminFrame> turns into a dimmed page. Pages
 * have no loading skeleton (React would hold one for 300 ms), so this is the
 * feedback for a slow click.
 */
function NavPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      data-nav-pending="true"
      role="status"
      className="absolute top-1/2 right-3 -translate-y-1/2"
    >
      <Spinner className="size-4 text-primary-strong" />
      <span className="sr-only">Loading</span>
    </span>
  );
}
