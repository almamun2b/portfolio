import { cva, type VariantProps } from "class-variance-authority";

// Shared by <Button>, <IconButton>, and <ButtonLink>, so a link styled as a
// button and a real button can never drift apart.
export const buttonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none",
    "transition-[translate,box-shadow,background-color,border-color,color,opacity] duration-300 ease-spring",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-button text-primary-foreground shadow-button",
          "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-white/0 after:transition-colors",
          "hover:-translate-y-0.5 hover:shadow-lift hover:after:bg-white/12 active:translate-y-0",
        ],
        outline: [
          "border border-border-strong bg-card text-foreground backdrop-blur-md",
          "hover:-translate-y-0.5 hover:border-primary hover:bg-muted active:translate-y-0",
        ],
        ghost: "text-foreground hover:bg-muted",
        soft: "bg-muted text-primary-strong hover:bg-primary/15",
        link: "h-auto rounded-sm px-0 text-primary-strong underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
