"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Fixed stack for floating buttons. On phones it steps aside while the hero's
 * call-to-action buttons are on screen, so it never covers them (WCAG 2.4.11).
 */
export function FloatingDock({ children }: { children: ReactNode }) {
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    const ctas = document.querySelector("[data-hero-ctas]");
    if (!ctas) return;
    const observer = new IntersectionObserver(([entry]) => {
      setOverHero(entry?.isIntersecting ?? false);
    });
    observer.observe(ctas);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      data-over-hero={overHero ? "" : undefined}
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 transition-[opacity,translate,visibility] duration-300 max-sm:data-over-hero:invisible max-sm:data-over-hero:translate-y-4 max-sm:data-over-hero:opacity-0 sm:right-6 sm:bottom-6"
    >
      {children}
    </div>
  );
}
