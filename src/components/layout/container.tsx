import { cn } from "cn";
import type { ComponentProps, ElementType } from "react";

/** Page-width wrapper: 1280px (1440px on very wide screens), 16px gutters on phones. */
export function Container({
  as: Tag = "div",
  className,
  ...props
}: ComponentProps<"div"> & { as?: ElementType }) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-7xl px-4 min-[1600px]:max-w-[90rem] sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}

/** A page section with consistent vertical rhythm. */
export function Section({
  className,
  containerClassName,
  children,
  ...props
}: ComponentProps<"section"> & { containerClassName?: string }) {
  return (
    <section
      className={cn("relative py-20 sm:py-24 lg:py-28", className)}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
