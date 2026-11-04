"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useRef,
  type ComponentProps,
} from "react";
import { toast } from "@/components/ui/toast";
import type { ActionResult } from "@/lib/action-result";
import { FormStateProvider } from "./form-state";
import { FormAlert } from "./submit-button";

type FormAction<T> = (
  prevState: ActionResult<T> | null,
  formData: FormData,
) => Promise<ActionResult<T>>;

/**
 * A form bound to a Server Action (`useActionState`), the one pattern for
 * every admin form:
 *
 *  - works without JS: the <form> has `action={formAction}`;
 *  - with JS it submits in a transition and keeps what was typed, because
 *    React would otherwise reset the fields after every action;
 *  - field errors come back from the server's Zod result and reach the fields
 *    through context (`aria-invalid` / `aria-describedby`); focus moves to the
 *    first invalid field;
 *  - other failures show as an alert (with the reference id for support);
 *  - success toasts, optionally resets the form, and calls `onSuccess`.
 *
 * Validation lives on the server only, so no Zod ships to the browser. The
 * form is `noValidate`: browser bubbles differ per browser and say less than
 * our messages, so the server's inline errors are the one consistent voice
 * (`required` / `type=email` stay for semantics and mobile keyboards).
 */
export function ActionForm<T = undefined>({
  action,
  successMessage,
  onSuccess,
  resetOnSuccess = false,
  children,
  ...form
}: {
  action: FormAction<T>;
  successMessage?: string;
  onSuccess?: (data: T) => void;
  resetOnSuccess?: boolean;
} & Omit<ComponentProps<"form">, "action" | "onSubmit">) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);

  const handleResult = useEffectEvent((result: ActionResult<T>) => {
    if (result.ok) {
      if (successMessage) toast.success(successMessage);
      if (resetOnSuccess) ref.current?.reset();
      onSuccess?.(result.data);
      return;
    }
    if (result.fieldErrors) {
      ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  });

  useEffect(() => {
    if (state) handleResult(state);
  }, [state]);

  const failure = state && !state.ok ? state : null;
  const formError = failure && !failure.fieldErrors ? failure : null;

  return (
    <FormStateProvider value={{ errors: failure?.fieldErrors ?? {}, pending }}>
      <form
        noValidate
        {...form}
        ref={ref}
        action={formAction}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          startTransition(() => {
            formAction(data);
          });
        }}
      >
        <FormAlert result={formError} />
        {children}
      </form>
    </FormStateProvider>
  );
}
