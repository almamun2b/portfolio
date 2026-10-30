"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Field, Input, fieldIds } from "@/components/ui/field";
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
