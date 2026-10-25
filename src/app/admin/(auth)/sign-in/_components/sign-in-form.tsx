"use client";

import { LogIn } from "lucide-react";
import { FormAlert, SubmitButton } from "@/components/forms/submit-button";
import { PasswordField, TextField } from "@/components/forms/form-fields";
import { useActionForm } from "@/components/forms/use-action-form";
import { signInSchema } from "@/lib/schemas/auth";
import { signInAction } from "@/server/actions/auth";

export function SignInForm({ next }: { next?: string }) {
  const { form, pending, formError, formProps } = useActionForm({
    schema: signInSchema,
    action: signInAction,
    defaultValues: { email: "", password: "", next: next ?? "" },
  });

  return (
    <form {...formProps} className="flex flex-col gap-5" aria-label="Sign in">
      <input type="hidden" {...form.register("next")} />
      <FormAlert result={formError} />
      <TextField
        formApi={form}
        name="email"
        label="Email"
        type="email"
        autoComplete="username"
        inputMode="email"
        autoFocus
        required
      />
      <PasswordField
        formApi={form}
        name="password"
        label="Password"
        autoComplete="current-password"
        required
      />
      <SubmitButton
        pending={pending}
        pendingLabel="Signing in"
        size="lg"
        className="mt-1 w-full"
      >
        <LogIn aria-hidden="true" /> Sign in
      </SubmitButton>
    </form>
  );
}
