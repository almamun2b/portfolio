import { cn } from "cn";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

/** Native <select> in the field style: full keyboard and mobile-picker support. */
export function Select({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <span className="relative inline-flex w-full">
      <select
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-2xl border border-input bg-card py-0 pr-10 pl-4 text-[0.92rem] text-foreground backdrop-blur-md",
          "transition-[border-color,box-shadow] duration-200 hover:border-primary/70",
          "focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_22%,transparent)] focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  );
}
