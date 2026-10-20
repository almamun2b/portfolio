import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";

const control = [
  "w-full rounded-2xl border border-input bg-card px-4 text-[0.95rem] text-foreground backdrop-blur-md",
  "placeholder:text-muted-foreground/80",
  "transition-[border-color,box-shadow] duration-200",
  "hover:border-primary/70",
  "focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_22%,transparent)] focus-visible:outline-none",
  "aria-invalid:border-error aria-invalid:focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--error)_22%,transparent)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
];

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        control,
        "min-h-36 resize-y py-3 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

/** Ids and ARIA wiring for a control inside <Field>. */
export function fieldIds(
  id: string,
  { hint, error }: { hint?: ReactNode; error?: ReactNode },
) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return {
    id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : undefined,
  } as const;
}

/**
 * Label, control, hint, and error in one stack. The control gets its ARIA
 * props from `fieldIds(id, { hint, error })` so errors are announced.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="text-muted-foreground"> (required)</span>
        ) : null}
      </Label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
