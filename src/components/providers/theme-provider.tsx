"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, type ComponentProps } from "react";

// Dark is the default and the server renders `class="dark"` on <html>, so
// visitors without JS get it too. The toggle stores the visitor's choice;
// the OS preference is deliberately not followed (PRODUCT.md, owner's call).
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "light"]}
      disableTransitionOnChange
      {...props}
    >
      <ThemeColorSync />
      {children}
    </NextThemesProvider>
  );
}

/** Keeps <meta name="theme-color"> (the browser bar) on the active theme. */
function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    // next-themes swaps the class in its own effect, which runs after this
    // child's; read the new --background on the next frame.
    const frame = requestAnimationFrame(() => {
      const meta = document.querySelector('meta[name="theme-color"]');
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      if (meta && color) meta.setAttribute("content", color);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [resolvedTheme]);
  return null;
}
