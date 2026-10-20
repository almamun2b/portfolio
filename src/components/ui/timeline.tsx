import { cn } from "cn";
import type { ReactNode } from "react";

export function Timeline({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <ol className={cn("relative flex flex-col gap-10", className)}>
      {children}
    </ol>
  );
}

/**
 * One entry: a node on a vertical rail. `current` marks the active entry with
 * a glowing node and a text label, so state never rests on colour alone.
 */
export function TimelineItem({
  current = false,
  last = false,
  className,
  children,
}: {
  current?: boolean;
  last?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <li className={cn("relative pl-10 sm:pl-14", className)}>
      {last ? null : (
        <span
          aria-hidden="true"
          className="absolute top-5 -bottom-10 left-[0.6875rem] w-px bg-linear-to-b from-primary/70 via-border-strong to-transparent sm:left-[1.1875rem]"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 left-0 flex size-6 items-center justify-center rounded-full border sm:left-2",
          current
            ? "border-primary bg-primary/20 text-primary shadow-[0_0_0_6px_color-mix(in_srgb,var(--primary)_14%,transparent)]"
            : "border-border-strong bg-card-solid text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full bg-current",
            current && "motion-safe:animate-pulse-dot",
          )}
        />
      </span>
      {children}
    </li>
  );
}
