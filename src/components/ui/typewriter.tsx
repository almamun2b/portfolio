"use client";

import { cn } from "cn";
import { useEffect, useRef } from "react";
import { motionAllowed } from "@/lib/motion";

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 2000;
const GAP_MS = 350;

/**
 * Cycles through `words`, typing and deleting. The server renders the first
 * word; screen readers get the full list once, never the keystrokes. Stops on
 * the first word under reduced motion or when animations are paused.
 */
export function Typewriter({
  words,
  className,
}: {
  words: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length < 2) return;
    if (!motionAllowed()) return;

    let timer = 0;
    let index = 0;
    let length = words[0]?.length ?? 0;
    let deleting = true;

    const step = () => {
      const word = words[index] ?? "";
      // Paused mid-cycle: show the whole word and check again later.
      if (!motionAllowed()) {
        el.textContent = word;
        length = word.length;
        deleting = true;
        timer = window.setTimeout(step, HOLD_MS);
        return;
      }
      if (deleting) {
        length -= 1;
        if (length <= 0) {
          deleting = false;
          index = (index + 1) % words.length;
          length = 0;
          el.textContent = "";
          timer = window.setTimeout(step, GAP_MS);
          return;
        }
        el.textContent = word.slice(0, length);
        timer = window.setTimeout(step, DELETE_MS);
        return;
      }
      const next = words[index] ?? "";
      length += 1;
      el.textContent = next.slice(0, length);
      if (length >= next.length) {
        deleting = true;
        timer = window.setTimeout(step, HOLD_MS);
        return;
      }
      timer = window.setTimeout(step, TYPE_MS);
    };

    timer = window.setTimeout(step, HOLD_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [words]);

  return (
    <span
      className={cn("inline-flex items-baseline whitespace-nowrap", className)}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" ref={ref}>
        {words[0]}
      </span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-secondary motion-safe:animate-caret"
      />
    </span>
  );
}
