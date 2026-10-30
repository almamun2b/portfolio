"use client";

import { useId } from "react";
import { Select } from "./select";
import { useUrlState } from "./use-url-state";

/** A <select> bound to one query param; choosing an option updates the URL. */
export function FilterSelect({
  param,
  label,
  value,
  options,
  allLabel,
}: {
  param: string;
  label: string;
  value: string | undefined;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  const id = useId();
  const { update, pending } = useUrlState();
  return (
    <div className="w-full sm:w-44" data-pending={pending ? "true" : undefined}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Select
        id={id}
        value={value ?? ""}
        onChange={(event) => {
          update({ [param]: event.target.value || undefined });
        }}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
