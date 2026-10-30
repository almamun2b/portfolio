"use client";

import { UserPlus } from "lucide-react";
import { ActionForm } from "@/components/forms/action-form";
import { PasswordField, TextField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { createUserAction } from "@/server/modules/users/users.actions";

export function CreateUserForm({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  return (
    <ActionForm
      action={createUserAction}
      successMessage="User created."
      onSuccess={onDone}
      className="flex flex-col gap-5"
      aria-label="Add user"
    >
      <TextField name="name" label="Full name" autoComplete="off" required />
      <TextField
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="off"
        required
      />
      <PasswordField
        name="password"
        label="Password"
        autoComplete="new-password"
        hint="At least 8 characters, with upper and lower case letters and a number."
        required
      />
      <PasswordField
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        required
      />
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton pendingLabel="Creating">
          <UserPlus aria-hidden="true" /> Create user
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
