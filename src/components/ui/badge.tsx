import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border-strong bg-muted text-primary-strong",
        outline: "border-border-strong bg-transparent text-muted-foreground",
        secondary: "border-secondary/30 bg-secondary/10 text-secondary-strong",
        success: "border-success/30 bg-success/10 text-success",
        solid: "border-transparent bg-gradient-button text-primary-foreground",
      },
      size: {
        sm: "h-6 px-2.5 text-xs",
        md: "h-7 px-3 text-[0.8rem]",
      },
    },
    defaultVariants: { variant: "default", size: "sm" },
  },
);

export function Badge({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/** Status pill with a pulsing dot, e.g. availability. */
export function StatusPill({
  className,
  tone = "secondary",
  children,
  ...props
}: ComponentProps<"span"> & { tone?: "secondary" | "success" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[0.82rem] font-medium backdrop-blur-md",
        tone === "success"
          ? "border-success/30 bg-success/10 text-success"
          : "border-border-strong bg-muted text-secondary-strong",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-current motion-safe:animate-pulse-dot"
      />
      {children}
    </span>
  );
}
