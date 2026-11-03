"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Field, Input, Textarea, fieldIds } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";
import { useFormState } from "./form-state";

interface Common {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
}

/** The first server error for `name`, with the ARIA wiring for it. */
function useFieldWiring(name: string, hint: ReactNode) {
  const id = useId();
  const error = useFormState().errors[name]?.[0];
  return { id, error, aria: fieldIds(id, { hint, error }) };
}

/** Text-like input with label, hint, and linked server error. */
export function TextField({
  name,
  label,
  hint,
  required,
  ...input
}: Common & Omit<ComponentProps<"input">, "name" | "id">) {
  const { id, error, aria } = useFieldWiring(name, hint);
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <Input {...input} {...aria} name={name} required={required} />
    </Field>
  );
}

/** Password input (show/hide) with label, hint, and linked server error. */
export function PasswordField({
  name,
  label,
  hint,
  required,
  ...input
}: Common & Omit<ComponentProps<"input">, "name" | "id" | "type">) {
  const { id, error, aria } = useFieldWiring(name, hint);
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <PasswordInput {...input} {...aria} name={name} required={required} />
    </Field>
  );
}

/** Multi-line text with label, hint, and linked server error. */
export function TextareaField({
  name,
  label,
  hint,
  required,
  ...input
}: Common & Omit<ComponentProps<"textarea">, "name" | "id">) {
  const { id, error, aria } = useFieldWiring(name, hint);
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <Textarea {...input} {...aria} name={name} required={required} />
    </Field>
  );
}

/** Native select with label, hint, and linked server error. */
export function SelectField({
  name,
  label,
  hint,
  required,
  options,
  ...input
}: Common &
  Omit<ComponentProps<"select">, "name" | "id" | "children"> & {
    options: { value: string; label: string }[];
  }) {
  const { id, error, aria } = useFieldWiring(name, hint);
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <Select {...input} {...aria} name={name} required={required}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}

/** One checkbox with a label, a hint, and a linked server error. */
export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  defaultChecked?: boolean;
}) {
  const { id, error, aria } = useFieldWiring(name, hint);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium"
      >
        <input
          type="checkbox"
          {...aria}
          name={name}
          defaultChecked={defaultChecked}
          className="size-5 shrink-0 cursor-pointer rounded-md border-input accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
