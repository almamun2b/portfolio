"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

// Fields only need register() and the errors, not the submit types.
type FieldForm<T extends FieldValues> = Pick<
  UseFormReturn<T, unknown, FieldValues>,
  "register" | "formState"
>;
import { Field, Input, fieldIds } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

interface Common<T extends FieldValues> {
  /** Named `formApi` because `form` is an HTML input attribute. */
  formApi: FieldForm<T>;
  name: Path<T>;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
}

function useFieldWiring<T extends FieldValues>(
  form: FieldForm<T>,
  name: Path<T>,
  hint: ReactNode,
) {
  const id = useId();
  const raw = form.formState.errors[name]?.message;
  const error = typeof raw === "string" ? raw : undefined;
  return {
    id,
    error,
    aria: fieldIds(id, { hint, error }),
    register: form.register(name),
  };
}

/** Text-like input wired to react-hook-form, with label, hint, and linked error. */
export function TextField<T extends FieldValues>({
  formApi,
  name,
  label,
  hint,
  required,
  ...input
}: Common<T> & Omit<ComponentProps<"input">, "name" | "id">) {
  const { id, error, aria, register } = useFieldWiring(formApi, name, hint);
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <Input {...input} {...aria} {...register} />
    </Field>
  );
}

/** Password input (show/hide) wired to react-hook-form. */
export function PasswordField<T extends FieldValues>({
  formApi,
  name,
  label,
  hint,
  required,
  ...input
}: Common<T> & Omit<ComponentProps<"input">, "name" | "id" | "type">) {
  const { id, error, aria, register } = useFieldWiring(formApi, name, hint);
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <PasswordInput {...input} {...aria} {...register} />
    </Field>
  );
}
