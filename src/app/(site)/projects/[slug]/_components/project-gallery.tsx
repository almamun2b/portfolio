"use client";

import { useState } from "react";
import { CoverArt } from "@/components/projects/cover-art";
import { Lightbox } from "@/components/ui/lightbox";
import type { Project } from "@/lib/schemas/content";
import { ScreenshotSlider } from "./screenshot-slider";

/**
 * Screenshots in a slider; any slide opens the fixed-size preview at that
 * image. Slider and preview share one index, so closing the preview leaves
 * the slider on the image you were looking at. Projects without screenshots
 * show their designed cover, labelled as an illustration.
 */
export function ProjectGallery({ project }: { project: Project }) {
  const shots = project.media.shots;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (shots.length === 0) {
    return (
      <section aria-label="Project preview" className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-3xl border border-border-strong">
          <div className="aspect-[16/8]">
            <CoverArt kind={project.coverArt} slug={project.slug} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {project.context === "personal"
            ? "There is no public deployment to capture, so the image above is an illustration of the interface."
            : "This is private client work, so there are no public screenshots. The image above is an illustration of the interface."}
        </p>
      </section>
    );
  }

  return (
    <>
      <ScreenshotSlider
        shots={shots}
        index={index}
        onIndexChange={setIndex}
        onOpen={(i) => {
          setIndex(i);
          setOpen(true);
        }}
      />
      <Lightbox
        images={shots}
        index={index}
        onIndexChange={setIndex}
        open={open}
        onOpenChange={setOpen}
        title={`${project.title}: screenshots`}
      />
    </>
  );
}
