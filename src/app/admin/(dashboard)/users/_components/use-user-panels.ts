"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useConfirmAction } from "@/components/forms/use-confirm-action";
import type { UserDTO } from "@/lib/dto";
import {
  deleteUserAction,
  setUserStatusAction,
} from "@/server/modules/users/users.actions";

export type Panel = "edit" | "password" | "status" | "delete" | null;

/**
 * State for one user's overlays: which panel is open, the two confirm
 * actions, and focus return to the menu button on close.
 */
export function useUserPanels(user: UserDTO, afterDelete?: string) {
  const [panel, setPanel] = useState<Panel>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const disabling = user.status === "ACTIVE";

  const close = () => {
    setPanel(null);
    trigger.current?.focus();
  };
  const done = () => {
    close();
    router.refresh();
  };

  const status = useConfirmAction({
    run: () =>
      setUserStatusAction(null, {
        id: user.id,
        status: disabling ? "DISABLED" : "ACTIVE",
      }),
    successMessage: disabling
      ? "User disabled and signed out."
      : "User enabled.",
    onDone: done,
  });
  const remove = useConfirmAction({
    run: () => deleteUserAction(null, { id: user.id }),
    successMessage: "User deleted.",
    onDone: () => {
      setPanel(null);
      if (afterDelete) router.replace(afterDelete as Route);
      else router.refresh();
    },
  });

  return { panel, setPanel, trigger, close, done, status, remove, disabling };
}

export type UserPanels = ReturnType<typeof useUserPanels>;
