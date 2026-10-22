"use client";

import { useEffect, useRef } from "react";

// The first sign of a visitor (or a few seconds after load, whichever comes
// first) starts the scene, so three.js never competes with hydration.
const INTENT_EVENTS = [
  "pointermove",
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;
const FALLBACK_MS = 4000;

// three.js needs WebGL 2. Software-only WebGL (SwiftShader, llvmpipe) fails
// this check, so those visitors never download three.js at all.
function hasHardwareWebGL() {
  const gl = document
    .createElement("canvas")
    .getContext("webgl2", { failIfMajorPerformanceCaveat: true });
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return gl !== null;
}

/**
 * Fixed, full-screen constellation behind the page (ported from uniqtrix).
 * Three.js loads on the first interaction or ~4 s after load, sets up in
 * small chunks, and is skipped entirely on Save-Data and on software-only
 * WebGL. The page's CSS glows remain as the fallback. It renders at 30 fps
 * and stops under reduced motion, "Pause animations", and hidden tabs.
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

    const lifetime = new AbortController();
    const waiting = new AbortController();
    let dispose: (() => void) | undefined;
    let fallback = 0;

    const start = () => {
      waiting.abort();
      window.clearTimeout(fallback);
      if (!hasHardwareWebGL()) return;
      void import("./scene")
        .then(({ createConstellation }) =>
          createConstellation(canvas, lifetime.signal),
        )
        .then((stop) => {
          if (!stop) return;
          if (lifetime.signal.aborted) {
            stop();
            return;
          }
          dispose = stop;
          canvas.dataset.ready = "";
        });
    };

    for (const type of INTENT_EVENTS)
      window.addEventListener(type, start, {
        once: true,
        passive: true,
        signal: waiting.signal,
      });
    const scheduleFallback = () => {
      fallback = window.setTimeout(start, FALLBACK_MS);
    };
    if (document.readyState === "complete") scheduleFallback();
    else
      window.addEventListener("load", scheduleFallback, {
        once: true,
        signal: waiting.signal,
      });

    return () => {
      waiting.abort();
      lifetime.abort();
      window.clearTimeout(fallback);
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
