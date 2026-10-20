import { cn } from "cn";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

// Native <details>/<summary>: keyboard and screen-reader behaviour for free,
// works without JS. Items sharing a `name` behave as an exclusive group.
// The open/close height animation lives in globals.css (::details-content).

export function Accordion({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col divide-y divide-border", className)}>
      {children}
    </div>
  );
}

export function AccordionItem({
  title,
  name,
  defaultOpen,
  className,
  children,
}: {
  title: ReactNode;
  name?: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <details name={name} open={defaultOpen} className={cn("group", className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl py-4 font-display text-base font-semibold text-foreground transition-colors hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="pb-5 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
