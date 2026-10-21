"use client";

import { cn } from "cn";
import {
  createContext,
  use,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { SlidingIndicator, useSlidingIndicator } from "./sliding-indicator";

// WAI-ARIA tabs with automatic activation: Arrow keys move and select,
// Home/End jump to the ends, Tab leaves the list. Inactive panels stay in the
// DOM (hidden) so server-rendered content remains indexable. The selected
// pill slides between tabs (SlidingIndicator).

interface TabsState {
  value: string;
  select: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsState | null>(null);

function useTabs() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error("Tabs parts must be used inside <Tabs>");
  return ctx;
}

const safe = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
}: {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const baseId = useId();
  const value = controlled ?? uncontrolled;
  const select = (next: string) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <TabsContext value={{ value, select, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext>
  );
}

export function TabsList({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const { value } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);
  const indicator = useSlidingIndicator(
    listRef,
    '[role="tab"][aria-selected="true"]',
    value,
  );
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])',
      ),
    );
    const current = tabs.findIndex((tab) => tab === document.activeElement);
    const last = tabs.length - 1;
    const target = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current <= 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    tabs[target]?.focus();
    tabs[target]?.click();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      data-indicator={indicator.box ? "ready" : undefined}
      className={cn(
        "group/pills relative inline-flex w-fit max-w-full [scrollbar-width:none] gap-1 overflow-x-auto rounded-full border border-border bg-muted p-1 backdrop-blur-md",
        className,
      )}
    >
      <SlidingIndicator state={indicator} />
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const { value: active, select, baseId } = useTabs();
  const selected = active === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${safe(value)}`}
      aria-controls={`${baseId}-panel-${safe(value)}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => {
        select(value);
      }}
      className={cn(
        "relative inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected
          ? "bg-gradient-button text-primary-foreground shadow-button group-data-[indicator=ready]/pills:bg-none group-data-[indicator=ready]/pills:shadow-none"
          : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsPanel({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const { value: active, baseId } = useTabs();
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${safe(value)}`}
      aria-labelledby={`${baseId}-tab-${safe(value)}`}
      hidden={active !== value}
      tabIndex={0}
      className={cn(
        "rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      {children}
    </div>
  );
}
