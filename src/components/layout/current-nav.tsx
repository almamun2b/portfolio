"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

// The only places in the public chrome that read the URL. On a route whose
// param isn't known at build time (a project published after the build), the
// pathname can't be resolved while prerendering, so the header renders these
// inside <Suspense> with the same navigation as the fallback, minus the
// "current page" highlight. Known pages resolve it on the server.

export function CurrentMainNav(
  props: Omit<ComponentProps<typeof MainNav>, "pathname">,
) {
  return <MainNav {...props} pathname={usePathname()} />;
}

export function CurrentMobileNav(
  props: Omit<ComponentProps<typeof MobileNav>, "pathname">,
) {
  return <MobileNav {...props} pathname={usePathname()} />;
}
