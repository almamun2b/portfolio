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
import {
  CATEGORY_LABELS,
  PROJECT_CATEGORIES,
  type ProjectCategory,
} from "@/lib/content-labels";

export type Filter = "all" | ProjectCategory;
type Counts = Record<Filter, number>;

/** id of the server-rendered list the filter shows and hides cards in. */
export const PROJECT_LIST_ID = "project-list";

const isCategory = (value: string | null): value is ProjectCategory =>
  PROJECT_CATEGORIES.includes(value as ProjectCategory);

/**
 * Category filter driven by the URL (?category=), so every filtered view is
 * shareable and reachable by agents. The cards are rendered once on the
 * server (see projects/page.tsx); this only sets `data-filter` on their list
 * and CSS hides the rest (globals.css › project filter).
 */
export function ProjectFilter({ counts }: { counts: Counts }) {
  const param = useSearchParams().get("category");
  const active: Filter = isCategory(param) ? param : "all";

  useEffect(() => {
    const list = document.getElementById(PROJECT_LIST_ID);
    if (list) list.dataset.filter = active;
  }, [active]);

  return (
    <>
      <ProjectFilterNav active={active} counts={counts} />
      <p className="sr-only" aria-live="polite">
        Showing {counts[active]} {counts[active] === 1 ? "project" : "projects"}
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
}: {
  active: Filter;
  counts: Counts;
}) {
  const filters: Filter[] = ["all", ...PROJECT_CATEGORIES];
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
                {filter === "all" ? "All" : CATEGORY_LABELS[filter]}
                <span
                  className={cn(
                    "rounded-full px-1.5 font-mono text-[0.7rem]",
                    selected ? "bg-white/20" : "bg-muted",
                  )}
                >
                  {counts[filter]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
