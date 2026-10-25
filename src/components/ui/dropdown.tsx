"use client";

import { cn } from "cn";
import Link from "next/link";
import type { Route } from "next";
import {
  createContext,
  useContext,
  useId,
  useRef,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";

// Action menu on the native Popover API: it renders in the top layer (so a
// table's overflow can't clip it), light-dismisses on outside click, and
// closes on Esc. We add the menu keyboard pattern (arrows, Home/End) and
// place it under its button.

const CloseContext = createContext<() => void>(() => undefined);

const itemClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-popover-foreground transition-colors outline-none hover:bg-muted focus-visible:bg-muted aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

export function Dropdown({
  label,
  trigger,
  triggerRef,
  triggerClassName,
  align = "end",
  children,
}: {
  /** Accessible name of the trigger button. */
  label: string;
  trigger: ReactNode;
  triggerRef?: RefObject<HTMLButtonElement | null>;
  triggerClassName?: string;
  align?: "start" | "end";
  children: ReactNode;
}) {
  const id = useId();
  const menu = useRef<HTMLDivElement>(null);

  const close = () => {
    menu.current?.hidePopover();
  };

  function place() {
    const el = menu.current;
    const anchor = document.querySelector(`[popovertarget="${id}"]`);
    if (!el || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    const width = el.offsetWidth;
    const left = align === "end" ? rect.right - width : rect.left;
    el.style.left = `${String(Math.max(8, Math.min(left, window.innerWidth - width - 8)))}px`;
    const below = rect.bottom + 6;
    const fits = below + el.offsetHeight < window.innerHeight - 8;
    el.style.top = `${String(fits ? below : Math.max(8, rect.top - el.offsetHeight - 6))}px`;
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ),
    ];
    const index = items.indexOf(document.activeElement as HTMLElement);
    const move = (to: number) => {
      event.preventDefault();
      items.at(to % items.length)?.focus();
    };
    if (event.key === "ArrowDown") move(index + 1);
    else if (event.key === "ArrowUp") move(index <= 0 ? -1 : index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(-1);
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        popoverTarget={id}
        aria-label={label}
        aria-haspopup="menu"
        className={cn(
          "inline-grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
          triggerClassName,
        )}
      >
        {trigger}
      </button>
      <div
        id={id}
        ref={menu}
        popover="auto"
        role="menu"
        aria-label={label}
        onKeyDown={onKeyDown}
        onToggle={(event) => {
          if (event.nativeEvent.newState !== "open") return;
          place();
          menu.current
            ?.querySelector<HTMLElement>(
              '[role="menuitem"]:not([aria-disabled="true"])',
            )
            ?.focus();
        }}
        className="fixed m-0 min-w-52 rounded-2xl border border-border-strong bg-popover p-1.5 text-popover-foreground shadow-card"
      >
        <CloseContext value={close}>{children}</CloseContext>
      </div>
    </>
  );
}

export function DropdownItem({
  icon,
  disabledReason,
  onSelect,
  className,
  children,
  ...props
}: Omit<ComponentProps<"button">, "onClick"> & {
  icon?: ReactNode;
  /** When set, the item is inert and this explains why. */
  disabledReason?: string;
  onSelect: () => void;
}) {
  const close = useContext(CloseContext);
  const disabled = Boolean(disabledReason);
  return (
    <button
      type="button"
      role="menuitem"
      aria-disabled={disabled || undefined}
      title={disabledReason}
      onClick={() => {
        if (disabled) return;
        close();
        onSelect();
      }}
      className={cn(itemClass, className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function DropdownLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const close = useContext(CloseContext);
  return (
    <Link
      href={href as Route}
      role="menuitem"
      onClick={close}
      className={itemClass}
    >
      {icon}
      {children}
    </Link>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1.5 h-px bg-border" />;
}

/** Wraps a form (e.g. sign-out) so its submit button is a menu item. */
export function DropdownForm({ children, ...props }: ComponentProps<"form">) {
  return (
    <form {...props} role="none">
      {children}
    </form>
  );
}

export function DropdownSubmit({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <button type="submit" role="menuitem" className={itemClass}>
      {icon}
      {children}
    </button>
  );
}
