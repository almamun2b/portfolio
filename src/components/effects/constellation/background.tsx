"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, full-screen constellation behind the page (ported from uniqtrix).
 * Three.js is loaded only after the page is idle, so it never competes with
 * the first paint, and is skipped entirely on Save-Data. The page's CSS
 * glows remain as the fallback when WebGL is unavailable. It renders at
 * 30 fps and stops under reduced motion, "Pause animations", and hidden tabs.
 */
export function ConstellationBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    // Safari has no requestIdleCallback; fall back to a short timeout.
    const hasIdle = "requestIdleCallback" in window;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      void import("./scene").then(({ createConstellation }) => {
        if (cancelled) return;
        dispose = createConstellation(canvas);
        if (dispose) canvas.dataset.ready = "";
      });
    };

    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      dispose?.();
      delete canvas.dataset.ready;
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full opacity-0 transition-opacity duration-[1.6s] data-ready:opacity-(--scene-opacity)"
    />
  );
}
