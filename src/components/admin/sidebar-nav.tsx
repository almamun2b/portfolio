"use client";

import { cn } from "cn";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { NAV_GROUPS, isActive, type NavItem } from "./nav-config";

/**
 * The module list. In the collapsed rail it shrinks to icons (the `collapsed:`
 * variant; labels stay in the accessibility tree and a tooltip names each
 * icon). `onNavigate` closes the mobile drawer. The active link needs the
 * pathname, which isn't known at build time under /admin/users/[id], so it
 * sits behind a Suspense whose fallback is the same list with nothing active.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavList pathname={null} onNavigate={onNavigate} />}>
      <ActiveNav onNavigate={onNavigate} />
    </Suspense>
  );
}

function ActiveNav({ onNavigate }: { onNavigate?: () => void }) {
  return <NavList pathname={usePathname()} onNavigate={onNavigate} />;
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-5 p-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p
            className={cn(
              "px-3 pb-1 text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase transition-opacity duration-200",
              "collapsed:h-0 collapsed:overflow-hidden collapsed:pb-0 collapsed:opacity-0",
            )}
          >
            {group.label}
          </p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  active={pathname !== null && isActive(item.href, pathname)}
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
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
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
          "collapsed:w-0 collapsed:flex-none collapsed:opacity-0",
        )}
      >
        <span className="truncate">{item.label}</span>
        {item.status === "soon" ? (
          <Badge variant="outline" className="h-5 px-2 text-[0.65rem]">
            Soon
          </Badge>
        ) : null}
      </span>
    </Link>
  );
  // The bubble only shows in the collapsed rail (never in the drawer).
  return (
    <Tooltip
      id={`nav-tip-${item.label.toLowerCase().replaceAll(" ", "-")}`}
      content={item.label}
      side="right"
      className="hidden collapsed:block"
      describe={false}
      wrapperClassName="flex w-full"
    >
      {link}
    </Tooltip>
  );
}
