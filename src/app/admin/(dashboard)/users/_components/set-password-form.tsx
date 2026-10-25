"use client";

import { KeyRound } from "lucide-react";
import { PasswordField } from "@/components/forms/form-fields";
import { FormAlert, SubmitButton } from "@/components/forms/submit-button";
import { useActionForm } from "@/components/forms/use-action-form";
import { Button } from "@/components/ui/button";
import { setPasswordSchema } from "@/lib/schemas/users";
import { setUserPasswordAction } from "@/server/actions/users";

export function SetPasswordForm({
  userId,
  onDone,
  onCancel,
}: {
  userId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { form, pending, formError, formProps } = useActionForm({
    schema: setPasswordSchema,
    action: setUserPasswordAction,
    defaultValues: { id: userId, password: "", confirmPassword: "" },
    successMessage: "Password set. The user was signed out everywhere.",
    onSuccess: onDone,
  });

  return (
    <form
      {...formProps}
      className="flex flex-col gap-5"
      aria-label="Set password"
    >
      <input type="hidden" {...form.register("id")} />
      <FormAlert result={formError} />
      <PasswordField
        formApi={form}
        name="password"
        label="New password"
        autoComplete="new-password"
        hint="At least 8 characters, with upper and lower case letters and a number."
        required
      />
      <PasswordField
        formApi={form}
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        required
      />
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton pending={pending} pendingLabel="Saving">
          <KeyRound aria-hidden="true" /> Set password
        </SubmitButton>
      </div>
    </form>
  );
}
