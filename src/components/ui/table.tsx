import { cn } from "cn";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import type { ComponentProps } from "react";

// Semantic table parts in the design system's style. Wrap in <TableScroll>
// so wide tables scroll inside their card instead of the page.

export function TableScroll({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      // Keyboard users can scroll a focusable region.
      tabIndex={0}
      className={cn(
        "overflow-x-auto rounded-[inherit] focus-visible:outline-offset-[-2px]",
        className,
      )}
      {...props}
    />
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      className={cn("w-full border-collapse text-left text-sm", className)}
      {...props}
    />
  );
}

export function THead({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "border-b border-border-strong bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props} />
  );
}

export function TRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("transition-colors hover:bg-muted/50", className)}
      {...props}
    />
  );
}

export function TH({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn("h-11 px-4 font-medium whitespace-nowrap", className)}
      {...props}
    />
  );
}

export function TD({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

/** Column header that sorts by linking to the toggled direction (works without JS). */
export function SortHeader({
  label,
  active,
  dir,
  href,
  className,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  /** Link that applies the next sort. */
  href: string;
  className?: string;
}) {
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={
        active ? (dir === "asc" ? "ascending" : "descending") : undefined
      }
      className={cn("h-11 px-4 font-medium whitespace-nowrap", className)}
    >
      <Link
        href={href as Route}
        className={cn(
          "-mx-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 uppercase transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon aria-hidden="true" className="size-3.5" />
      </Link>
    </th>
  );
}
