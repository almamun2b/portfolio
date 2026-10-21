"use client";

import { cn } from "cn";
import { useLayoutEffect, useState, type RefObject } from "react";

// A pill that slides to the active item of a segmented list (tabs, filter
// links). The server render has no indicator: the active item paints its own
// background, so the list reads correctly without JS. Once measured, the list
// gets `data-indicator="ready"` and items drop their background in favour of
// the indicator (style them with `group-data-[indicator=ready]/pills:`).

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IndicatorState {
  box: Box | null;
  /** False for the first placement, so the pill doesn't fly in from 0,0. */
  animate: boolean;
}

/**
 * Tracks the element matching `selector` inside `listRef` (which must be
 * positioned, e.g. `relative`). `activeKey` re-runs the measurement when the
 * selection changes. Scrolls an overflowing list so the active item is
 * visible.
 */
export function useSlidingIndicator(
  listRef: RefObject<HTMLElement | null>,
  selector: string,
  activeKey: string,
): IndicatorState {
  const [box, setBox] = useState<Box | null>(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const active = list.querySelector<HTMLElement>(selector);
      setBox(
        active
          ? {
              x: active.offsetLeft,
              y: active.offsetTop,
              width: active.offsetWidth,
              height: active.offsetHeight,
            }
          : null,
      );
    };
    measure();
    revealActive(list, selector);
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [listRef, selector, activeKey]);

  useLayoutEffect(() => {
    if (!box || animate) return;
    const frame = requestAnimationFrame(() => {
      setAnimate(true);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [box, animate]);

  return { box, animate };
}

function revealActive(list: HTMLElement, selector: string) {
  if (list.scrollWidth <= list.clientWidth) return;
  const active = list.querySelector<HTMLElement>(selector);
  if (!active) return;
  const left = active.offsetLeft - 8;
  const right = active.offsetLeft + active.offsetWidth + 8 - list.clientWidth;
  if (left < list.scrollLeft) list.scrollTo({ left });
  else if (right > list.scrollLeft) list.scrollTo({ left: right });
}

export function SlidingIndicator({
  state,
  className,
}: {
  state: IndicatorState;
  className?: string;
}) {
  const { box, animate } = state;
  if (!box) return null;
  return (
    <span
      aria-hidden="true"
      style={{
        width: box.width,
        height: box.height,
        translate: `${String(box.x)}px ${String(box.y)}px`,
      }}
      className={cn(
        "pointer-events-none absolute top-0 left-0 rounded-full bg-gradient-button shadow-button",
        animate &&
          "transition-[translate,width,height] duration-500 ease-spring in-data-[motion=paused]:transition-none motion-reduce:transition-none",
        className,
      )}
    />
  );
}
