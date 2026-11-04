"use client";

import { useState, useTransition } from "react";
import { toast } from "@/components/ui/toast";
import type { ActionResult } from "@/lib/action-result";

/**
 * For confirm dialogs (disable, delete, revoke): runs a Server Action, tracks
 * pending, keeps a failure message for the dialog, and toasts on success.
 */
export function useConfirmAction<T>({
  run,
  successMessage,
  onDone,
}: {
  run: () => Promise<ActionResult<T>>;
  successMessage: string;
  onDone: (data: T) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const confirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await run();
      if (result.ok) {
        toast.success(successMessage);
        onDone(result.data);
      } else {
        setError(result.error);
      }
    });
  };

  return {
    confirm,
    pending,
    error,
    clearError: () => {
      setError(null);
    },
  };
}
