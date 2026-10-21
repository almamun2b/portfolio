"use client";

import { cn } from "cn";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore } from "react";
import { motionAllowed } from "@/lib/motion";

const THUMB_TRAVEL = "1.55rem";
const EASE_BOUNCE = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // --ease-bounce
const noop = () => () => undefined;

/**
 * The uniqtrix day/night switch. Its look comes from the `.light` class on
 * <html> (set before paint), so the server and client render the same markup
 * and there is no hydration mismatch or flash.
 *
 * next-themes disables CSS transitions while it swaps the theme class (so the
 * whole page doesn't cross-fade), which would make the thumb jump. The slide
 * is therefore a Web Animation, which that rule doesn't touch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const thumbRef = useRef<HTMLSpanElement>(null);
  // The stored theme is unknown on the server: state attributes wait for the
  // client so hydration matches.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const isLight = resolvedTheme === "light";

  const toggle = () => {
    const next = isLight ? "dark" : "light";
    setTheme(next);
    const thumb = thumbRef.current;
    if (!thumb || !motionAllowed()) return;
    const [from, to] =
      next === "light" ? ["0px", THUMB_TRAVEL] : [THUMB_TRAVEL, "0px"];
    thumb.animate([{ translate: from }, { translate: to }], {
      duration: 450,
      easing: EASE_BOUNCE,
    });
    for (const icon of thumb.querySelectorAll("svg")) {
      icon.animate(
        [
          { opacity: 0, rotate: next === "light" ? "-90deg" : "90deg" },
          { opacity: 1, rotate: "0deg" },
        ],
        { duration: 350, easing: "ease-out" },
      );
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={mounted ? isLight : undefined}
      aria-label="Light theme"
      title={
        mounted
          ? `Switch to ${isLight ? "dark" : "light"} theme`
          : "Toggle light and dark theme"
      }
      className={cn(
        "relative inline-flex h-8 w-[3.6rem] shrink-0 cursor-pointer items-center rounded-full border p-1",
        "border-border-glow bg-toggle-track light:border-border-strong",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
        className,
      )}
    >
      <span
        ref={thumbRef}
        aria-hidden="true"
        className={cn(
          "grid size-6 place-items-center rounded-full bg-toggle-thumb text-toggle-thumb-foreground shadow-md",
          "translate-x-0 light:translate-x-[1.55rem]",
        )}
      >
        <Moon className="size-3.5 light:hidden" />
        <Sun className="hidden size-3.5 light:block" />
      </span>
    </button>
  );
}
