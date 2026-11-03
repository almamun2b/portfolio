"use client";

import { cn } from "cn";
import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  SlidingIndicator,
  useSlidingIndicator,
} from "@/components/ui/sliding-indicator";

export type Filter = string;
type Counts = Record<Filter, number>;
export interface FilterCategory {
  slug: string;
  name: string;
}

/** id of the server-rendered list the filter shows and hides cards in. */
export const PROJECT_LIST_ID = "project-list";

/**
 * Category filter driven by the URL (?category=), so every filtered view is
 * shareable and reachable by agents. The cards are rendered once on the
 * server (see projects/page.tsx); this only sets `data-filter` on their list
 * and CSS hides the rest (globals.css › project filter).
 */
export function ProjectFilter({
  counts,
  categories,
}: {
  counts: Counts;
  categories: FilterCategory[];
}) {
  const param = useSearchParams().get("category");
  const active: Filter =
    param && categories.some((c) => c.slug === param) ? param : "all";

  useEffect(() => {
    const list = document.getElementById(PROJECT_LIST_ID);
    if (!list) return;
    list.dataset.filter = active;
    // Categories are database rows, so the match runs here, not in CSS.
    for (const item of list.children) {
      const slugs = (item as HTMLElement).dataset.categories?.split(" ") ?? [];
      (item as HTMLElement).hidden =
        active !== "all" && !slugs.includes(active);
    }
  }, [active]);

  return (
    <>
      <ProjectFilterNav
        active={active}
        counts={counts}
        categories={categories}
      />
      <p className="sr-only" aria-live="polite">
        Showing {counts[active] ?? 0}{" "}
        {counts[active] === 1 ? "project" : "projects"}
      </p>
    </>
  );
}

/**
 * It's a set of links, not tabs: each option is a navigation. The active
 * pill slides between options.
 */
export function ProjectFilterNav({
  active,
  counts,
  categories,
}: {
  active: Filter;
  counts: Counts;
  categories: FilterCategory[];
}) {
  const labels = new Map(categories.map((c) => [c.slug, c.name]));
  const filters: Filter[] = ["all", ...categories.map((c) => c.slug)];
  const listRef = useRef<HTMLElement>(null);
  const indicator = useSlidingIndicator(
    listRef,
    'a[aria-current="page"]',
    active,
  );

  return (
    <nav
      ref={listRef}
      aria-label="Filter projects by category"
      data-indicator={indicator.box ? "ready" : undefined}
      className="group/pills relative w-fit max-w-full rounded-3xl border border-border glass p-1.5 sm:rounded-full"
    >
      <SlidingIndicator state={indicator} />
      <ul className="flex max-w-full flex-wrap gap-1">
        {filters.map((filter) => {
          const selected = filter === active;
          const href = (
            filter === "all" ? "/projects" : `/projects?category=${filter}`
          ) as Route;
          return (
            <li key={filter}>
              <Link
                href={href}
                scroll={false}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-[background-color,color] duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  selected
                    ? "bg-gradient-button text-primary-foreground shadow-button group-data-[indicator=ready]/pills:bg-none group-data-[indicator=ready]/pills:shadow-none"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                )}
              >
                {filter === "all" ? "All" : (labels.get(filter) ?? filter)}
                <span
                  className={cn(
                    "rounded-full px-1.5 font-mono text-[0.7rem]",
                    selected ? "bg-white/20" : "bg-muted",
                  )}
                >
                  {counts[filter] ?? 0}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
