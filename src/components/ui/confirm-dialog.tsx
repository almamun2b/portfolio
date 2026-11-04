"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "./button";
import { Dialog } from "./dialog";
import { Input, Label } from "./field";
import { Spinner } from "./spinner";

/**
 * Confirmation for destructive or disruptive actions. `confirmPhrase` makes
 * the user type something (e.g. the email being deleted) before the confirm
 * button enables. The caller owns `pending` and closes the dialog on success;
 * `error` shows a failed attempt inside the dialog.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  tone = "default",
  confirmPhrase,
  pending = false,
  error,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  tone?: "default" | "danger";
  confirmPhrase?: string;
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  const id = useId();
  const blocked = confirmPhrase !== undefined && typed.trim() !== confirmPhrase;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setTyped("");
        onOpenChange(next);
      }}
      title={title}
      size="sm"
    >
      <div className="flex flex-col gap-5">
        <div className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>
        {confirmPhrase !== undefined ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor={id}>
              Type{" "}
              <strong className="font-mono text-foreground">
                {confirmPhrase}
              </strong>{" "}
              to confirm
            </Label>
            <Input
              id={id}
              value={typed}
              onChange={(event) => {
                setTyped(event.target.value);
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm font-medium text-error">
            {error}
          </p>
        ) : null}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={blocked || pending}
            aria-busy={pending}
            className={
              tone === "danger"
                ? "bg-error bg-none text-background shadow-none hover:shadow-none"
                : undefined
            }
          >
            {pending ? <Spinner /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
