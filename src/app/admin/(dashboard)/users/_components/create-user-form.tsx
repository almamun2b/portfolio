"use client";

import { UserPlus } from "lucide-react";
import { PasswordField, TextField } from "@/components/forms/form-fields";
import { FormAlert, SubmitButton } from "@/components/forms/submit-button";
import { useActionForm } from "@/components/forms/use-action-form";
import { Button } from "@/components/ui/button";
import { createUserSchema } from "@/lib/schemas/users";
import { createUserAction } from "@/server/actions/users";

export function CreateUserForm({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const { form, pending, formError, formProps } = useActionForm({
    schema: createUserSchema,
    action: createUserAction,
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    successMessage: "User created.",
    onSuccess: onDone,
  });

  return (
    <form {...formProps} className="flex flex-col gap-5" aria-label="Add user">
      <FormAlert result={formError} />
      <TextField
        formApi={form}
        name="name"
        label="Full name"
        autoComplete="off"
        required
      />
      <TextField
        formApi={form}
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="off"
        required
      />
      <PasswordField
        formApi={form}
        name="password"
        label="Password"
        autoComplete="new-password"
        hint="At least 8 characters, with upper and lower case letters and a number."
        required
      />
      <PasswordField
        formApi={form}
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        required
      />
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton pending={pending} pendingLabel="Creating">
          <UserPlus aria-hidden="true" /> Create user
        </SubmitButton>
      </div>
    </form>
  );
}
