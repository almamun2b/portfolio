"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { IconButton } from "./button";
import { Dialog } from "./dialog";

export interface LightboxImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Full-size image viewer on <Dialog>. The frame never changes size: the
 * panel width is fixed, the image stage has a fixed height, and every image
 * is fitted inside it (object-contain), so stepping between a desktop and a
 * phone screenshot doesn't make the modal jump. Arrow keys and the buttons
 * move between images; the position is announced politely ("2 of 5").
 */
export function Lightbox({
  images,
  index,
  onIndexChange,
  open,
  onOpenChange,
  title,
}: {
  images: readonly LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}) {
  const count = images.length;
  const image = images[index];
  const go = (delta: number) => {
    onIndexChange((index + delta + count) % count);
  };

  useEffect(() => {
    if (!open || count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, count, onIndexChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <figure className="flex flex-col gap-4">
        <div className="relative h-[min(68dvh,46rem)] w-full overflow-hidden rounded-2xl border border-border bg-background/70">
          {image ? (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 76rem, 100vw"
              className="object-contain p-2 motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in"
            />
          ) : null}
          {count > 1 ? (
            <>
              <IconButton
                label="Previous image"
                variant="outline"
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-popover/80"
                onClick={() => {
                  go(-1);
                }}
              >
                <ChevronLeft aria-hidden="true" />
              </IconButton>
              <IconButton
                label="Next image"
                variant="outline"
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-popover/80"
                onClick={() => {
                  go(1);
                }}
              >
                <ChevronRight aria-hidden="true" />
              </IconButton>
            </>
          ) : null}
        </div>
        <figcaption className="flex min-h-11 items-start justify-between gap-4 text-sm text-muted-foreground">
          <span className="line-clamp-2 max-w-prose">{image?.alt}</span>
          {count > 1 ? (
            <span
              aria-live="polite"
              className="shrink-0 rounded-full border border-border-strong bg-muted px-3 py-1 font-mono text-xs text-foreground tabular-nums"
            >
              {index + 1} of {count}
            </span>
          ) : null}
        </figcaption>
      </figure>
    </Dialog>
  );
}
