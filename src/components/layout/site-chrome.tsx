import type { ReactNode } from "react";
import { ConstellationBackground } from "@/components/effects/constellation/background";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { FloatingActions } from "@/components/widgets/floating-actions";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Header, main landmark, footer, and the animated background for every public page. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-gradient-button px-5 py-3 text-sm font-semibold text-primary-foreground shadow-button transition-transform focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <ConstellationBackground />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="relative isolate outline-none">
        {children}
      </main>
      <SiteFooter />
      <FloatingActions />
    </>
  );
}
