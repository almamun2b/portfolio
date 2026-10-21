"use client";

import { cn } from "cn";
import { Pause, Play } from "lucide-react";
import { useSyncExternalStore } from "react";

/** localStorage key; the inline script in the root layout reads it before paint. */
export const MOTION_KEY = "motion";

/** Runs before first paint (root layout), so a paused page never animates. */
export const motionInitScript = `try{if(localStorage.getItem("${MOTION_KEY}")==="paused")document.documentElement.dataset.motion="paused"}catch(e){}`;

const isPaused = () => document.documentElement.dataset.motion === "paused";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => {
    observer.disconnect();
  };
}

/**
 * "Pause animations" (WCAG 2.2.2): sets `data-motion="paused"` on <html>.
 * CSS then stops the marquee, orbit, pills, and glows the same way reduced
 * motion does; the typewriter and the Three.js scene read the same flag.
 */
export function MotionToggle({ className }: { className?: string }) {
  const paused = useSyncExternalStore(subscribe, isPaused, () => false);

  const toggle = () => {
    const next = !paused;
    if (next) document.documentElement.dataset.motion = "paused";
    else delete document.documentElement.dataset.motion;
    try {
      if (next) localStorage.setItem(MOTION_KEY, "paused");
      else localStorage.removeItem(MOTION_KEY);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md py-0.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {paused ? (
        <Play aria-hidden="true" className="size-3.5" />
      ) : (
        <Pause aria-hidden="true" className="size-3.5" />
      )}
      {paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
