"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type SubmitHandler,
} from "react-hook-form";
import type { z } from "zod";
import { toast } from "@/components/ui/toast";
import type { ActionResult } from "@/lib/action-result";

type FormAction<TData> = (
  prevState: ActionResult<TData> | null,
  formData: FormData,
) => Promise<ActionResult<TData>>;

/**
 * react-hook-form + a Server Action, one pattern for every admin form.
 *
 * - Zod validates in the browser first (instant feedback, focus on the first
 *   error); the same schema runs again on the server.
 * - The `<form>` also has `action={formAction}`, so it submits without JS.
 * - Server field errors are written back onto the fields; other failures
 *   come back as `formError` (with a reference id for support).
 * - Success shows a toast and calls `onSuccess`.
 */
export function useActionForm<
  TIn extends FieldValues,
  TOut extends FieldValues,
  TData = undefined,
>({
  schema,
  action,
  defaultValues,
  successMessage,
  onSuccess,
}: {
  schema: z.ZodType<TOut, TIn>;
  action: FormAction<TData>;
  defaultValues: DefaultValues<TIn>;
  successMessage?: string;
  onSuccess?: (data: TData) => void;
}) {
  const form = useForm<TIn, unknown, TOut>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });
  const [state, formAction, pending] = useActionState(action, null);
  // Subscribes this component to validation errors for the field components.
  const { errors } = form.formState;

  const handleResult = useEffectEvent((result: ActionResult<TData>) => {
    if (result.ok) {
      if (successMessage) toast.success(successMessage);
      onSuccess?.(result.data);
      return;
    }
    const entries = Object.entries(result.fieldErrors ?? {});
    for (const [name, messages] of entries) {
      form.setError(name as Path<TIn>, {
        type: "server",
        message: messages[0],
      });
    }
    const first = entries[0]?.[0];
    if (first) form.setFocus(first as Path<TIn>);
  });

  useEffect(() => {
    if (state) handleResult(state);
  }, [state]);

  const submit: SubmitHandler<TOut> = (_values, event) => {
    const element: unknown = event?.target;
    if (!(element instanceof HTMLFormElement)) return;
    // Read from the DOM so hidden inputs (ids, `next`) travel too.
    const data = new FormData(element);
    startTransition(() => {
      formAction(data);
    });
  };

  const hasFieldErrors = state && !state.ok && Boolean(state.fieldErrors);

  return {
    form,
    errors,
    pending,
    formError: state && !state.ok && !hasFieldErrors ? state : null,
    formProps: {
      action: formAction,
      onSubmit: form.handleSubmit(submit),
      noValidate: true,
    },
  };
}
