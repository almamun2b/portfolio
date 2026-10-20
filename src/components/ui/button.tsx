import { cn } from "cn";
import type { ComponentProps } from "react";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

export type ButtonProps = ComponentProps<"button"> & ButtonVariantProps;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/** Icon-only button: the accessible name is required, not optional. */
export function IconButton({
  label,
  variant = "ghost",
  size = "icon",
  ...props
}: Omit<ButtonProps, "aria-label"> & { label: string }) {
  return (
    <Button
      variant={variant}
      size={size}
      aria-label={label}
      title={label}
      {...props}
    />
  );
}
