import { cn } from "cn";
import Image from "next/image";
import type { Shot } from "@/lib/schemas/content";

/** Thumbnail strip and "n / N" counter under the slider. */
export function ScreenshotThumbs({
  shots,
  index,
  onSelect,
}: {
  shots: Shot[];
  index: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <ul
        className="flex gap-2 overflow-x-auto p-1"
        aria-label="Choose a screenshot"
      >
        {shots.map((shot, i) => (
          <li key={shot.src} className="shrink-0">
            <button
              type="button"
              onClick={() => {
                onSelect(i);
              }}
              aria-label={`Show screenshot ${String(i + 1)}: ${shot.alt}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative block h-14 w-22 overflow-hidden rounded-xl border-2 transition-[border-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                i === index
                  ? "border-primary"
                  : "border-border opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={shot.src}
                alt=""
                fill
                sizes="88px"
                className={cn(
                  "object-cover",
                  shot.device === "mobile" ? "object-top" : "object-left-top",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <p
        aria-live="polite"
        className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums"
      >
        {index + 1} / {shots.length}
      </p>
    </div>
  );
}
