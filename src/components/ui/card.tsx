import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

export const cardVariants = cva(
  "relative isolate overflow-hidden rounded-3xl border text-card-foreground",
  {
    variants: {
      variant: {
        glass: "border-border glass",
        solid: "border-border bg-card-solid",
        outline: "border-border-strong bg-transparent",
      },
      interactive: {
        true: [
          "transition-[translate,box-shadow,border-color] duration-500 ease-spring",
          "hover:-translate-y-1.5 hover:border-border-glow hover:shadow-lift",
          "focus-within:border-border-glow",
          // The uniqtrix bottom bar: a gradient rule that grows on hover.
          "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-gradient-brand after:transition-transform after:duration-500 after:ease-out-expo",
          "focus-within:after:scale-x-100 hover:after:scale-x-100",
        ],
        false: "",
      },
    },
    defaultVariants: { variant: "glass", interactive: false },
  },
);

export function Card({
  className,
  variant,
  interactive,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-6 sm:p-7", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-lg leading-snug font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[0.92rem] leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("px-6 pb-6 sm:px-7 sm:pb-7", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-border px-6 py-4 sm:px-7",
        className,
      )}
      {...props}
    />
  );
}
