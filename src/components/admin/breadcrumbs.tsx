"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-config";

function labelFor(href: string, previous: string | undefined): string {
  const known = NAV_ITEMS.find((item) => item.href === href);
  if (known) return known.label;
  if (previous === "users") return "Details";
  if (href.endsWith("/account")) return "Account";
  return "Page";
}

/** Trail derived from the URL and the nav registry. Phones show only the current page. */
export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const trail = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      href,
      label: index === 0 ? "Admin" : labelFor(href, segments[index - 1]),
    };
  });
  const crumbs = trail.length > 1 ? trail.slice(1) : trail.slice(0, 1);
  const shown =
    trail.length > 1
      ? [trail[0], ...crumbs].filter((c) => c !== undefined)
      : trail;

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {shown.map((crumb, index) => {
          const last = index === shown.length - 1;
          return (
            <li
              key={crumb.href}
              className={
                last
                  ? "flex min-w-0 items-center"
                  : "hidden items-center gap-1.5 sm:flex"
              }
            >
              {last ? (
                <span
                  aria-current="page"
                  className="truncate font-medium text-foreground"
                >
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.href as Route}
                    className="rounded-md hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight aria-hidden="true" className="size-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
