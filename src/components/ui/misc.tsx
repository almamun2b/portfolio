import { cn } from "cn";
import type { ComponentProps } from "react";

/** Gradient hairline. Decorative by default; pass `decorative={false}` to expose it. */
export function Separator({
  className,
  decorative = true,
  orientation = "horizontal",
  ...props
}: ComponentProps<"div"> & {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "separator", "aria-orientation": orientation })}
      className={cn(
        orientation === "horizontal"
          ? "hairline w-full"
          : "w-px self-stretch bg-border-strong",
        className,
      )}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-[linear-gradient(90deg,var(--muted)_0%,var(--border-strong)_50%,var(--muted)_100%)] bg-size-[200%_100%] motion-safe:animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border-strong bg-muted px-1.5 font-mono text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
