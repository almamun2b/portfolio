"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling (Lenis) for the whole page. It drives the real
 * document scroll, so CSS scroll-driven reveals and the sticky header keep
 * working. Off under reduced motion and paused while a modal dialog is open.
 * Its stylesheet is inlined in globals.css (one less render-blocking request).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: Lenis | undefined;
    let observer: MutationObserver | undefined;

    // Created once the page is idle: Lenis measures the document when it
    // starts, which would force a layout during hydration.
    const start = () => {
      const instance = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        // No `anchors`: in-page links land below the sticky header through CSS
        // scroll-padding-top (globals.css). Offsetting here as well put them a
        // second header-height lower (audit #16).
        // Let dialogs, the chat panel, and other scrollable boxes scroll natively.
        prevent: (node) =>
          node.closest("dialog, [data-lenis-prevent]") !== null,
      });
      lenis = instance;

      const sync = () => {
        if (document.querySelector("dialog[open]")) instance.stop();
        else instance.start();
      };
      observer = new MutationObserver(sync);
      observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ["open"],
      });
    };

    // Safari has no requestIdleCallback; fall back to a short timeout.
    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 200);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      observer?.disconnect();
      lenis?.destroy();
    };
  }, []);

  return null;
}
