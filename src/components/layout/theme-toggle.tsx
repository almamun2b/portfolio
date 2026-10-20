"use client";

import { cn } from "cn";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * The uniqtrix day/night switch. Its look comes from the `.light` class on
 * <html> (set before paint), so the server and client render the same markup
 * and there is no hydration mismatch or flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
      }}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      className={cn(
        "relative inline-flex h-8 w-[3.6rem] shrink-0 cursor-pointer items-center rounded-full border p-1 transition-colors duration-300",
        "border-border-glow bg-[#062a24] light:border-border-strong light:bg-linear-to-r light:from-[#ccfbf1] light:to-[#cffafe]",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-6 place-items-center rounded-full shadow-md transition-[translate,background-color] duration-400 ease-bounce",
          "translate-x-0 bg-linear-to-br from-[#6ee7b7] to-[#34d399] text-[#062a24]",
          "light:translate-x-[1.55rem] light:from-[#5eead4] light:to-[#14b8a6] light:text-[#064e3b]",
        )}
      >
        <Moon className="size-3.5 light:hidden" />
        <Sun className="hidden size-3.5 light:block" />
      </span>
    </button>
  );
}
