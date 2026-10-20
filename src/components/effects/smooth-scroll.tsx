"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling (Lenis) for the whole page. It drives the real
 * document scroll, so CSS scroll-driven reveals and the sticky header keep
 * working. Off under reduced motion, paused while a modal dialog is open,
 * and in-page anchors land below the sticky header.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -96 },
      // Let dialogs, the chat panel, and other scrollable boxes scroll natively.
      prevent: (node) => node.closest("dialog, [data-lenis-prevent]") !== null,
    });

    const sync = () => {
      if (document.querySelector("dialog[open]")) lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
