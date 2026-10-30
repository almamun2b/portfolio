"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ActionResult } from "@/lib/action-result";
import { useFormState } from "./form-state";

/**
 * Submit with a pending state: disabled while running, announced via
 * aria-busy. Inside an <ActionForm> it follows the form's pending state;
 * pass `pending` to override.
 */
export function SubmitButton({
  pending: pendingOverride,
  children,
  pendingLabel,
  ...props
}: Omit<ComponentProps<typeof Button>, "type"> & {
  pending?: boolean;
  pendingLabel?: string;
}) {
  const form = useFormState();
  const pending = pendingOverride ?? form.pending;
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? <Spinner /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}

/** Form-level error summary (anything that isn't tied to one field). */
export function FormAlert({
  result,
}: {
  result: Extract<ActionResult, { ok: false }> | null;
}) {
  if (!result) return null;
  return (
    <p
      role="alert"
      className="rounded-2xl border border-error/40 bg-error/10 px-4 py-3 text-sm font-medium text-error"
    >
      {result.error}
    </p>
  );
}
