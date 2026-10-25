"use client";

import { Save } from "lucide-react";
import { TextField } from "@/components/forms/form-fields";
import { FormAlert, SubmitButton } from "@/components/forms/submit-button";
import { useActionForm } from "@/components/forms/use-action-form";
import { Button } from "@/components/ui/button";
import type { UserDTO } from "@/lib/dto";
import { updateUserSchema } from "@/lib/schemas/users";
import { updateUserAction } from "@/server/actions/users";

export function EditUserForm({
  user,
  onDone,
  onCancel,
}: {
  user: UserDTO;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { form, pending, formError, formProps } = useActionForm({
    schema: updateUserSchema,
    action: updateUserAction,
    defaultValues: { id: user.id, name: user.name ?? "", email: user.email },
    successMessage: "User updated.",
    onSuccess: onDone,
  });

  return (
    <form {...formProps} className="flex flex-col gap-5" aria-label="Edit user">
      <input type="hidden" {...form.register("id")} />
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
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton pending={pending} pendingLabel="Saving">
          <Save aria-hidden="true" /> Save changes
        </SubmitButton>
      </div>
    </form>
  );
}
