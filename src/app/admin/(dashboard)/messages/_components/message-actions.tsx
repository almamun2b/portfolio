"use client";

import { Archive, CircleCheck, Mail, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useConfirmAction } from "@/components/forms/use-confirm-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { MessageDTO } from "@/lib/dto";
import {
  deleteMessageAction,
  setMessageStatusAction,
} from "@/server/modules/messages/messages.actions";

/**
 * Status buttons and delete. Opening a NEW message marks it read once, so
 * the inbox count drops without a click.
 */
export function MessageActions({ message }: { message: MessageDTO }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const marked = useRef(false);

  useEffect(() => {
    if (message.status !== "NEW" || marked.current) return;
    marked.current = true;
    void setMessageStatusAction(null, { id: message.id, status: "READ" }).then(
      () => {
        router.refresh();
      },
    );
  }, [message.id, message.status, router]);

  const change = (status: MessageDTO["status"]) => {
    void setMessageStatusAction(null, { id: message.id, status }).then(() => {
      router.refresh();
    });
  };

  const remove = useConfirmAction({
    run: () => deleteMessageAction(null, { id: message.id }),
    successMessage: "Message deleted.",
    onDone: () => {
      router.replace("/admin/messages");
    },
  });

  return (
    <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:p-6">
      {message.status === "ARCHIVED" ? (
        <Button
          variant="outline"
          onClick={() => {
            change("READ");
          }}
        >
          <CircleCheck aria-hidden="true" /> Move back to inbox
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => {
            change("ARCHIVED");
          }}
        >
          <Archive aria-hidden="true" /> Archive
        </Button>
      )}
      {message.status === "READ" ? (
        <Button
          variant="outline"
          onClick={() => {
            change("NEW");
          }}
        >
          <Mail aria-hidden="true" /> Mark as unread
        </Button>
      ) : null}
      <Button
        variant="outline"
        className="text-error sm:ml-auto"
        onClick={() => {
          setConfirming(true);
        }}
      >
        <Trash2 aria-hidden="true" /> Delete
      </Button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={(open) => {
          if (!open) {
            remove.clearError();
            setConfirming(false);
          }
        }}
        title="Delete this message?"
        description="This removes it for good. It can't be undone."
        confirmLabel="Delete message"
        tone="danger"
        pending={remove.pending}
        error={remove.error}
        onConfirm={remove.confirm}
      />
    </Card>
  );
}
