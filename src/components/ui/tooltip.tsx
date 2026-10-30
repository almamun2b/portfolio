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
  side?: "top" | "bottom" | "right";
  children: ReactElement<{ "aria-describedby"?: string }>;
}) {
  return (
    <span className="group/tooltip relative inline-flex">
      {cloneElement(children, { "aria-describedby": id })}
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute z-50 rounded-lg border border-border-strong bg-popover px-2.5 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-card transition-[opacity,translate] duration-200",
          "group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100",
          side !== "right" && "left-1/2 -translate-x-1/2",
          side === "top" &&
            "bottom-full mb-2 translate-y-1 group-focus-within/tooltip:translate-y-0 group-hover/tooltip:translate-y-0",
          side === "bottom" &&
            "top-full mt-2 -translate-y-1 group-focus-within/tooltip:translate-y-0 group-hover/tooltip:translate-y-0",
          side === "right" &&
            "top-1/2 left-full ml-3 -translate-x-1 -translate-y-1/2 group-focus-within/tooltip:translate-x-0 group-hover/tooltip:translate-x-0",
        )}
      >
        {content}
      </span>
    </span>
  );
}
