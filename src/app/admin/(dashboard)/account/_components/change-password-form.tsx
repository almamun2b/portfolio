"use client";

import { KeyRound } from "lucide-react";
import { PasswordField } from "@/components/forms/form-fields";
import { FormAlert, SubmitButton } from "@/components/forms/submit-button";
import { useActionForm } from "@/components/forms/use-action-form";
import { changePasswordSchema } from "@/lib/schemas/auth";
import { changePasswordAction } from "@/server/actions/account";

export function ChangePasswordForm() {
  const { form, pending, formError, formProps } = useActionForm({
    schema: changePasswordSchema,
    action: changePasswordAction,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    successMessage: "Password updated. Your other devices were signed out.",
    onSuccess: () => {
      form.reset();
    },
  });

  return (
    <form
      {...formProps}
      className="flex max-w-md flex-col gap-5"
      aria-label="Change password"
    >
      <FormAlert result={formError} />
      <PasswordField
        formApi={form}
        name="currentPassword"
        label="Current password"
        autoComplete="current-password"
        required
      />
      <PasswordField
        formApi={form}
        name="newPassword"
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
      <SubmitButton
        pending={pending}
        pendingLabel="Updating"
        className="self-start"
      >
        <KeyRound aria-hidden="true" /> Update password
      </SubmitButton>
    </form>
  );
}
