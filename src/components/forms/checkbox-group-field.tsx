"use client";

import { useId, type ReactNode } from "react";
import { useFormState } from "./form-state";

/**
 * A group of checkboxes that submit under one name (`name=a&name=b`), so a
 * multi-select works without JS: the action turns repeated names into an
 * array. Use for categories and technology stacks.
 */
export function CheckboxGroupField({
  name,
  legend,
  hint,
  options,
  defaultValues = [],
  columns = "sm:grid-cols-2",
}: {
  name: string;
  legend: ReactNode;
  hint?: ReactNode;
  options: { value: string; label: string }[];
  defaultValues?: string[];
  columns?: string;
}) {
  const id = useId();
  const error = useFormState().errors[name]?.[0];
  const selected = new Set(defaultValues);
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <fieldset
      className="flex min-w-0 flex-col gap-2"
      aria-describedby={describedBy}
    >
      <legend className="text-sm font-medium">{legend}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <div
        className={`grid grid-cols-1 gap-x-4 gap-y-0.5 rounded-2xl border border-input bg-card px-3 py-2 ${columns}`}
      >
        {options.map((option, index) => (
          <label
            key={option.value}
            className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm"
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={selected.has(option.value)}
              aria-invalid={error ? true : undefined}
              data-first={index === 0 ? "" : undefined}
              className="size-4 shrink-0 cursor-pointer accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
