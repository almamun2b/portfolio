"use client";

import { Save } from "lucide-react";
import { ActionForm } from "@/components/forms/action-form";
import { TextField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import type { UserDTO } from "@/lib/dto";
import { updateUserAction } from "@/server/modules/users/users.actions";

export function EditUserForm({
  user,
  onDone,
  onCancel,
}: {
  user: UserDTO;
  onDone: () => void;
  onCancel: () => void;
}) {
  return (
    <ActionForm
      action={updateUserAction}
      successMessage="User updated."
      onSuccess={onDone}
      className="flex flex-col gap-5"
      aria-label="Edit user"
    >
      <input type="hidden" name="id" value={user.id} />
      <TextField
        name="name"
        label="Full name"
        defaultValue={user.name ?? ""}
        autoComplete="off"
        required
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        defaultValue={user.email}
        autoComplete="off"
        required
      />
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton pendingLabel="Saving">
          <Save aria-hidden="true" /> Save changes
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
