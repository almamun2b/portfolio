"use client";

import { Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "./spinner";
import { useUrlState } from "./use-url-state";

/**
 * Search box bound to ?q=. Without JS it is a GET form (press Enter); with JS
 * it also updates the URL as you type, after a short pause.
 */
export function SearchInput({
  action,
  defaultValue,
  placeholder = "Search",
  label,
  preserve = {},
}: {
  /** Page path the GET form submits to. */
  action: string;
  defaultValue: string;
  placeholder?: string;
  label: string;
  /** Other active params, kept by the no-JS form. */
  preserve?: Record<string, string | undefined>;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const { update, pending } = useUrlState();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Follow the URL when it changes elsewhere (back button, "Clear filters").
  const [syncedWith, setSyncedWith] = useState(defaultValue);
  if (syncedWith !== defaultValue) {
    setSyncedWith(defaultValue);
    setValue(defaultValue);
  }

  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );

  function onChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (next.trim() !== defaultValue) update({ q: next.trim() || undefined });
    }, 350);
  }

  return (
    <form
      role="search"
      action={action}
      method="get"
      className="relative w-full sm:max-w-sm"
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id={id}
        name="q"
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 w-full rounded-2xl border border-input bg-card pr-10 pl-11 text-[0.92rem] text-foreground backdrop-blur-md transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/80 hover:border-primary/70 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_22%,transparent)] focus-visible:outline-none"
      />
      {Object.entries(preserve).map(([key, val]) =>
        val ? <input key={key} type="hidden" name={key} value={val} /> : null,
      )}
      {pending ? (
        <span
          role="status"
          className="absolute top-1/2 right-3.5 -translate-y-1/2"
        >
          <Spinner className="text-primary-strong" />
          <span className="sr-only">Searching</span>
        </span>
      ) : null}
    </form>
  );
}
