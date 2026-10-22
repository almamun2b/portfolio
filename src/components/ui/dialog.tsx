"use client";

import { cva } from "class-variance-authority";
import { cn } from "cn";
import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

// Built on the native modal <dialog>: the browser handles the focus trap,
// Esc, inertness of the page behind, and returning focus to the opener.
// Page scroll is locked in globals.css (`html:has(dialog[open]:modal)`).

const dialogVariants = cva(
  [
    "fixed m-auto overflow-visible bg-transparent p-0 text-foreground",
    "backdrop:bg-backdrop backdrop:backdrop-blur-sm",
    "opacity-0 open:opacity-100 starting:open:opacity-0",
    "transition-[opacity,translate,scale,display,overlay] transition-discrete duration-300 ease-out-expo",
    "backdrop:opacity-0 open:backdrop:opacity-100 starting:open:backdrop:opacity-0",
    "backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-300",
  ],
  {
    variants: {
      side: {
        center:
          "max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,var(--dialog-width))] scale-95 open:scale-100 starting:open:scale-95",
        right:
          "mr-0 h-dvh max-h-none w-[min(100%,24rem)] translate-x-full open:translate-x-0 starting:open:translate-x-full",
        left: "ml-0 h-dvh max-h-none w-[min(100%,24rem)] -translate-x-full open:translate-x-0 starting:open:-translate-x-full",
      },
    },
    defaultVariants: { side: "center" },
  },
);

const WIDTHS = { sm: "26rem", md: "34rem", lg: "48rem", xl: "80rem" } as const;

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Keep the title for screen readers but don't show it. */
  hideHeader?: boolean;
  side?: "center" | "right" | "left";
  size?: keyof typeof WIDTHS;
  className?: string;
  panelClassName?: string;
  children: ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  hideHeader = false,
  side = "center",
  size = "md",
  className,
  panelClassName,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Light dismiss where supported; the click handler covers the rest.
      {...{ closedby: "any" }}
      onClose={() => {
        onOpenChange(false);
      }}
      // Close only when the press both starts and ends on the backdrop, so a
      // text selection dragged out of the panel doesn't dismiss it.
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressedBackdrop.current && event.target === event.currentTarget)
          ref.current?.close();
        pressedBackdrop.current = false;
      }}
      className={cn(dialogVariants({ side }), className)}
      style={{ "--dialog-width": WIDTHS[size] } as CSSProperties}
    >
      <div
        className={cn(
          "flex max-h-[inherit] flex-col border border-border-strong bg-popover text-popover-foreground shadow-card",
          side === "center" ? "rounded-3xl" : "h-full",
          side === "right" && "border-y-0 border-r-0",
          side === "left" && "border-y-0 border-l-0",
          panelClassName,
        )}
      >
        <div
          className={cn(
            "flex items-start justify-between gap-4 p-5 sm:p-6",
            hideHeader && "sr-only",
          )}
        >
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {hideHeader ? null : (
            <DialogCloseButton onClose={() => ref.current?.close()} />
          )}
        </div>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            !hideHeader && "px-5 pb-6 sm:px-6",
          )}
        >
          {children}
        </div>
      </div>
    </dialog>
  );
}

export function DialogCloseButton({
  onClose,
  className,
  label = "Close",
}: {
  onClose: () => void;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-muted text-foreground transition-colors hover:border-primary hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <X className="size-4" aria-hidden="true" />
    </button>
  );
}

/** Side panel (mobile navigation, filters). Same dialog, pinned to an edge. */
export function Sheet({
  side = "right",
  ...props
}: Omit<DialogProps, "side" | "size"> & { side?: "right" | "left" }) {
  return <Dialog side={side} {...props} />;
}
