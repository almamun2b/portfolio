import { cn } from "cn";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/schemas/content";
import { projectHref } from "@/lib/site";

export function ProjectPager({
  previous,
  next,
}: {
  previous: Project | null;
  next: Project | null;
}) {
  return (
    <nav
      aria-label="More projects"
      className="grid grid-cols-1 gap-4 border-t border-border pt-10 sm:grid-cols-2"
    >
      {[previous, next].map((project, i) =>
        project ? (
          <Link
            key={project.slug}
            href={projectHref(project.slug)}
            className={cn(
              "group flex flex-col gap-2 rounded-3xl border border-border glass p-6 transition-[border-color,translate] duration-300 ease-spring hover:-translate-y-1 hover:border-border-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              i === 1 && "sm:items-end sm:text-right",
            )}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {i === 0 ? (
                <ArrowLeft
                  aria-hidden="true"
                  className="size-3.5 transition-transform group-hover:-translate-x-1"
                />
              ) : null}
              {i === 0 ? "Previous project" : "Next project"}
              {i === 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                />
              ) : null}
            </span>
            <span className="font-display text-lg font-semibold text-foreground">
              {project.title}
            </span>
          </Link>
        ) : (
          <span key={i === 0 ? "prev" : "next"} />
        ),
      )}
    </nav>
  );
}
