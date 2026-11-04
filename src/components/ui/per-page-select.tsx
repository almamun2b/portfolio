"use client";

import { useId } from "react";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/lib/schemas/common";
import { Select } from "./select";
import { useUrlState } from "./use-url-state";

/**
 * Rows-per-page dropdown bound to ?limit=. With JS, choosing a size updates
 * the URL (and resets to page 1); without JS it is a GET form with an Apply
 * button, so the control works either way.
 */
export function PerPageSelect({
  action,
  value,
  preserve = {},
}: {
  /** Page path the GET form submits to. */
  action: string;
  value: number;
  /** Other active params, kept by the no-JS form. */
  preserve?: Record<string, string | undefined>;
}) {
  const id = useId();
  const { update, pending } = useUrlState();
  return (
    <form
      action={action}
      method="get"
      className="flex items-center gap-2 text-sm"
      data-pending={pending ? "true" : undefined}
    >
      <label htmlFor={id} className="text-muted-foreground">
        Rows per page
      </label>
      <div className="w-24">
        <Select
          id={id}
          name="limit"
          value={String(value)}
          className="h-9"
          onChange={(event) => {
            const size = Number(event.target.value);
            update({
              limit: size === DEFAULT_PAGE_SIZE ? undefined : String(size),
            });
          }}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </div>
      {Object.entries(preserve).map(([key, val]) =>
        val ? <input key={key} type="hidden" name={key} value={val} /> : null,
      )}
      <noscript>
        <button type="submit" className="underline">
          Apply
        </button>
      </noscript>
    </form>
  );
}
