import { cn } from "cn";
import { cloneElement, type ReactElement } from "react";

// CSS-only tooltip: shown on hover and keyboard focus, wired to the trigger
// with aria-describedby. Use it for supplementary text only; the trigger must
// already have an accessible name of its own.
export function Tooltip({
  id,
  content,
  side = "top",
  children,
}: {
  id: string;
  content: string;
  side?: "top" | "bottom";
  children: ReactElement<{ "aria-describedby"?: string }>;
}) {
  return (
    <span className="group/tooltip relative inline-flex">
      {cloneElement(children, { "aria-describedby": id })}
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border-strong bg-popover px-2.5 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-card transition-[opacity,translate] duration-200",
          "group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100",
          side === "top"
            ? "bottom-full mb-2 translate-y-1 group-focus-within/tooltip:translate-y-0 group-hover/tooltip:translate-y-0"
            : "top-full mt-2 -translate-y-1 group-focus-within/tooltip:translate-y-0 group-hover/tooltip:translate-y-0",
        )}
      >
        {content}
      </span>
    </span>
  );
}
