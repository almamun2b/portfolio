"use client";

import { KeyRound } from "lucide-react";
import { ActionForm } from "@/components/forms/action-form";
import { PasswordField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { changePasswordAction } from "@/server/modules/account/account.actions";

export function ChangePasswordForm() {
  return (
    <ActionForm
      action={changePasswordAction}
      successMessage="Password updated. Your other devices were signed out."
      resetOnSuccess
      className="flex max-w-md flex-col gap-5"
      aria-label="Change password"
    >
      <PasswordField
        name="currentPassword"
        label="Current password"
        autoComplete="current-password"
        required
      />
      <PasswordField
        name="newPassword"
        label="New password"
        autoComplete="new-password"
        hint="At least 8 characters, with upper and lower case letters and a number."
        required
      />
      <PasswordField
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        required
      />
      <SubmitButton pendingLabel="Updating" className="self-start">
        <KeyRound aria-hidden="true" /> Update password
      </SubmitButton>
    </ActionForm>
  );
}
