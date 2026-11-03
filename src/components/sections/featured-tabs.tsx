"use client";

import { useState, type ReactNode } from "react";
import { Reveal } from "@/components/effects/reveal";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";
type Filter = string;

/**
 * Category tabs over server-rendered project cards. Only the active panel
 * holds the list, so each card is in the HTML once instead of once per tab
 * (audit #5). Without JS the "All" panel shows every card.
 */
export function FeaturedTabs({
  filters,
  items,
}: {
  filters: { value: Filter; label: string }[];
  items: { slug: string; categories: string[]; node: ReactNode }[];
}) {
  const [active, setActive] = useState<Filter>("all");
  const visible =
    active === "all"
      ? items
      : items.filter((item) => item.categories.includes(active));
  return (
    <Tabs
      defaultValue="all"
      value={active}
      onValueChange={(value) => {
        setActive(value);
      }}
      className="mt-12 flex flex-col gap-8"
    >
      <TabsList label="Filter selected work">
        {filters.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {filters.map((filter) => (
        <TabsPanel key={filter.value} value={filter.value}>
          {filter.value === active ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item, i) => (
                <Reveal as="li" key={item.slug} index={i % 3}>
                  {item.node}
                </Reveal>
              ))}
            </ul>
          ) : null}
        </TabsPanel>
      ))}
    </Tabs>
  );
}
