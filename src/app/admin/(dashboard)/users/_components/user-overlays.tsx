"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import type { UserDTO } from "@/lib/dto";
import { EditUserForm } from "./edit-user-form";
import { SetPasswordForm } from "./set-password-form";
import type { UserPanels } from "./use-user-panels";

/** Everything a user's row menu can open. Content mounts only while open. */
export function UserOverlays({
  user,
  panels,
}: {
  user: UserDTO;
  panels: UserPanels;
}) {
  const { panel, close, done, status, remove, disabling } = panels;
  const label = user.name ?? user.email;

  return (
    <>
      <Drawer
        open={panel === "edit"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Edit user"
        description={user.email}
      >
        {panel === "edit" ? (
          <EditUserForm user={user} onDone={done} onCancel={close} />
        ) : null}
      </Drawer>
      <Dialog
        open={panel === "password"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Set password"
        description={`Sets a new password for ${label}. They are signed out everywhere.`}
      >
        {panel === "password" ? (
          <SetPasswordForm userId={user.id} onDone={done} onCancel={close} />
        ) : null}
      </Dialog>
      <ConfirmDialog
        open={panel === "status"}
        onOpenChange={(open) => {
          if (!open) {
            status.clearError();
            close();
          }
        }}
        title={disabling ? `Disable ${label}?` : `Enable ${label}?`}
        description={
          disabling
            ? "They are signed out on every device and can't sign in until you enable the account again."
            : "They will be able to sign in again with their current password."
        }
        confirmLabel={disabling ? "Disable user" : "Enable user"}
        tone={disabling ? "danger" : "default"}
        pending={status.pending}
        error={status.error}
        onConfirm={status.confirm}
      />
      <ConfirmDialog
        open={panel === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            remove.clearError();
            close();
          }
        }}
        title={`Delete ${label}?`}
        description="This permanently removes the account and signs them out. It can't be undone. Their past activity stays in the audit log."
        confirmLabel="Delete user"
        tone="danger"
        confirmPhrase={user.email}
        pending={remove.pending}
        error={remove.error}
        onConfirm={remove.confirm}
      />
    </>
  );
}
