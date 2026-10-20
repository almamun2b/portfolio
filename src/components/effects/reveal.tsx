import { cn } from "cn";
import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Rises into view as it scrolls in. Pure CSS (scroll-driven animation in
 * globals.css): no observer, no hydration cost, and content is never hidden
 * by script: no-JS, unsupported browsers, and reduced motion see it plainly.
 * `index` staggers siblings. Never wrap the hero (it would delay LCP).
 */
export function Reveal({
  as: Tag = "div",
  index = 0,
  className,
  children,
}: {
  as?: ElementType;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      data-reveal=""
      className={cn(className)}
      style={{ "--reveal-index": index } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
