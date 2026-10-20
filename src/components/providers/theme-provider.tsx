"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// Dark is the default and the server renders `class="dark"` on <html>, so
// visitors without JS get it too. The toggle stores the visitor's choice;
// the OS preference is deliberately not followed (PRODUCT.md, owner's call).
export function ThemeProvider(
  props: ComponentProps<typeof NextThemesProvider>,
) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "light"]}
      disableTransitionOnChange
      {...props}
    />
  );
}
