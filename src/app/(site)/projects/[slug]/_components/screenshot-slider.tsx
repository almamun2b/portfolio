"use client";

import { cn } from "cn";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Monitor,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { useEffect, type KeyboardEvent } from "react";
import { IconButton } from "@/components/ui/button";
import type { Shot } from "@/lib/schemas/content";
import { ScreenshotThumbs } from "./screenshot-thumbs";

/**
 * Screenshot carousel (Embla). Every slide shares one 16:10 stage and the
 * image is fitted inside it, so desktop, phone, and detail shots sit in the
 * same frame. `index` is shared with the lightbox: whichever moves, the
 * other follows.
 */
export function ScreenshotSlider({
  shots,
  index,
  onIndexChange,
  onOpen,
}: {
  shots: Shot[];
  index: number;
  onIndexChange: (index: number) => void;
  onOpen: (index: number) => void;
}) {
  const multiple = shots.length > 1;
  const [viewportRef, embla] = useEmblaCarousel({
    loop: multiple,
    duration: 25,
  });

  useEffect(() => {
    if (!embla) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      embla.reInit({ duration: 0 });
    }
    const onSelect = () => {
      onIndexChange(embla.selectedScrollSnap());
    };
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onIndexChange]);

  useEffect(() => {
    if (embla && embla.selectedScrollSnap() !== index) embla.scrollTo(index);
  }, [embla, index]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") embla?.scrollPrev();
    if (event.key === "ArrowRight") embla?.scrollNext();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Project screenshots"
      onKeyDown={onKeyDown}
      className="flex flex-col gap-4"
    >
      <div className="relative">
        <div
          ref={viewportRef}
          className="overflow-hidden rounded-3xl border border-border-strong"
        >
          <div className="flex touch-pan-y">
            {shots.map((shot, i) => (
              <div
                key={shot.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${String(i + 1)} of ${String(shots.length)}`}
                className="min-w-0 flex-[0_0_100%]"
              >
                <SlideStage
                  shot={shot}
                  first={i === 0}
                  onOpen={() => {
                    onOpen(i);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {multiple ? (
          <>
            <IconButton
              label="Previous screenshot"
              variant="outline"
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-popover/80"
              onClick={() => embla?.scrollPrev()}
            >
              <ChevronLeft aria-hidden="true" />
            </IconButton>
            <IconButton
              label="Next screenshot"
              variant="outline"
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-popover/80"
              onClick={() => embla?.scrollNext()}
            >
              <ChevronRight aria-hidden="true" />
            </IconButton>
          </>
        ) : null}
      </div>
      {multiple ? (
        <ScreenshotThumbs
          shots={shots}
          index={index}
          onSelect={(i) => embla?.scrollTo(i)}
        />
      ) : null}
    </section>
  );
}

/** One slide: the shot fitted in the shared 16:10 stage; click to enlarge. */
function SlideStage({
  shot,
  first,
  onOpen,
}: {
  shot: Shot;
  first: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Enlarge: ${shot.alt}`}
      className="group relative block aspect-[16/10] w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        preload={first}
        sizes="(min-width: 1280px) 76rem, 100vw"
        className={cn(
          "object-contain",
          shot.device === "detail" ? "bg-surface-light p-6" : "bg-card-solid",
          shot.device === "mobile" && "py-4",
        )}
      />
      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
        {shot.device === "mobile" ? (
          <Smartphone aria-hidden="true" className="size-3.5" />
        ) : (
          <Monitor aria-hidden="true" className="size-3.5" />
        )}
        {shot.device}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full border border-border-strong bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Expand className="size-4" />
      </span>
    </button>
  );
}
