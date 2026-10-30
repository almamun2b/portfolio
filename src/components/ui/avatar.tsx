import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

const avatarVariants = cva(
  "inline-grid shrink-0 place-items-center rounded-full border border-border-strong bg-gradient-tile font-display font-semibold text-primary-strong select-none",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-14 text-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** Up to two initials from a name, falling back to the email's first letter. */
export function initials(
  name: string | null | undefined,
  email: string,
): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const letters =
    words.length > 1
      ? `${words[0]?.[0] ?? ""}${words[words.length - 1]?.[0] ?? ""}`
      : (words[0]?.slice(0, 2) ?? email.slice(0, 1));
  return letters.toUpperCase();
}

/** Decorative by default: the person's name is always shown next to it. */
export function Avatar({
  name,
  email,
  size,
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> &
  VariantProps<typeof avatarVariants> & {
    name?: string | null;
    email: string;
  }) {
  return (
    <span
      aria-hidden="true"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {initials(name, email)}
    </span>
  );
}
