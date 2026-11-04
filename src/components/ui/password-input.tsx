"use client";

import { cn } from "cn";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Input } from "./field";

/**
 * Password field with a show/hide toggle. The toggle is a real button with
 * `aria-pressed`, so screen readers announce the state. Pass `ref` and the
 * rest through.
 */
export function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;
  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        autoCapitalize="none"
        spellCheck={false}
        className={cn("pr-12", className)}
      />
      <button
        type="button"
        onClick={() => {
          setVisible((v) => !v);
        }}
        aria-pressed={visible}
        aria-label="Show password"
        title={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Icon aria-hidden="true" className="size-[1.1rem]" />
      </button>
    </div>
  );
}
