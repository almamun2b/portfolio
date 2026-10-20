"use client";

import { cn } from "cn";
import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import {
  CATEGORY_LABELS,
  PROJECT_CATEGORIES,
  type ProjectCategory,
} from "@/lib/schemas/content";

interface Item {
  slug: string;
  categories: ProjectCategory[];
  node: ReactNode;
}
type Filter = "all" | ProjectCategory;

const isCategory = (value: string | null): value is ProjectCategory =>
  PROJECT_CATEGORIES.includes(value as ProjectCategory);

/**
 * Category filter driven by the URL (?category=), so every filtered view is
 * shareable and reachable by agents. It's a set of links, not tabs: each
 * option is a navigation.
 */
export function FilteredProjects({
  items,
  counts,
}: {
  items: Item[];
  counts: Record<Filter, number>;
}) {
  const param = useSearchParams().get("category");
  const active: Filter = isCategory(param) ? param : "all";
  const visible =
    active === "all"
      ? items
      : items.filter((i) => i.categories.includes(active));
  const filters: Filter[] = ["all", ...PROJECT_CATEGORIES];

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label="Filter projects by category">
        <ul className="inline-flex max-w-full flex-wrap gap-1 rounded-3xl border border-border glass p-1.5 sm:rounded-full">
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
                    "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-[background-color,color] duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    selected
                      ? "bg-gradient-button text-primary-foreground shadow-button"
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
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <li
            key={item.slug}
            className="motion-safe:animate-in motion-safe:duration-500 motion-safe:fade-in motion-safe:slide-in-from-bottom-3"
          >
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
