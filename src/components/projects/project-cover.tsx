import { cn } from "cn";
import { Lock } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/schemas/content";
import { CoverArt } from "./cover-art";

function hostOf(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Browser-framed cover: the project's first screenshot when one exists,
 * otherwise its designed illustration. The address bar shows the live host,
 * or "private" for client work that can't be linked.
 */
export function ProjectCover({
  project,
  sizes,
  priority = false,
  className,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const shot =
    project.media.shots.find((s) => s.device === "desktop") ??
    project.media.shots.find((s) => s.device === "detail");
  const host = hostOf(project.links.live);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border-strong bg-card-solid",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-2 border-b border-border px-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <span className="mx-auto inline-flex max-w-[70%] items-center gap-1.5 truncate rounded-md bg-muted px-3 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
          {host ?? (
            <>
              <Lock aria-hidden="true" className="size-3" /> private
            </>
          )}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {shot ? (
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes={sizes}
            preload={priority}
            className={cn(
              "transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]",
              shot.device === "detail"
                ? "bg-[#f5f5f7] object-contain p-4"
                : "object-cover object-left-top",
            )}
          />
        ) : (
          <CoverArt kind={project.coverArt} slug={project.slug} />
        )}
      </div>
    </div>
  );
}
