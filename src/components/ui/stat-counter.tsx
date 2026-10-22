"use client";

import { useEffect, useRef } from "react";

/**
 * Counts up to `value` when scrolled into view. The server renders the final
 * number, so no-JS visitors, reduced motion, and anything already on screen
 * at load see the real value with no layout shift. The animated digits are
 * aria-hidden; screen readers get the final value once.
 */
export function StatCounter({
  value,
  suffix = "",
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The observer's first entry says where the counter is at load, without
    // a getBoundingClientRect() that would force layout during hydration.
    let first = true;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (first) {
          first = false;
          // Already on screen or scrolled past: keep the real value.
          if (entry.boundingClientRect.top < window.innerHeight) {
            observer.disconnect();
            return;
          }
          el.textContent = "0";
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 4;
          el.textContent = String(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        <span ref={ref}>{value}</span>
        {suffix}
      </span>
    </>
  );
}
