import { cn } from "cn";
import type { ReactNode } from "react";

/**
 * Infinite horizontal ticker. The list renders twice for a seamless loop; the
 * copy is inert and hidden from assistive tech. Pauses on hover or focus.
 * With reduced motion it stops and wraps into a static, centred list.
 */
export function Marquee({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const track =
    "flex shrink-0 items-center gap-0 motion-reduce:flex-wrap motion-reduce:justify-center";
  return (
    <section
      aria-label={label}
      className={cn(
        "group relative overflow-hidden mask-x-from-90% mask-x-to-100% motion-reduce:mask-none",
        className,
      )}
    >
      <div className="flex w-max group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-safe:animate-marquee motion-reduce:w-full">
        <ul className={track}>{children}</ul>
        <ul
          className={cn(track, "motion-reduce:hidden")}
          aria-hidden="true"
          inert
        >
          {children}
        </ul>
      </div>
    </section>
  );
}
