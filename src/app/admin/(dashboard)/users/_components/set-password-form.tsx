"use client";

import { KeyRound } from "lucide-react";
import { ActionForm } from "@/components/forms/action-form";
import { PasswordField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { setUserPasswordAction } from "@/server/modules/users/users.actions";

export function SetPasswordForm({
  userId,
  onDone,
  onCancel,
}: {
  userId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  return (
    <ActionForm
      action={setUserPasswordAction}
      successMessage="Password set. The user was signed out everywhere."
      onSuccess={onDone}
      className="flex flex-col gap-5"
      aria-label="Set password"
    >
      <input type="hidden" name="id" value={userId} />
      <PasswordField
        name="password"
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
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton pendingLabel="Saving">
          <KeyRound aria-hidden="true" /> Set password
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
