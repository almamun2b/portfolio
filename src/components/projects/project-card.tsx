import { cn } from "cn";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { TechIcon } from "@/components/icons/tech-icon";
import { Badge } from "@/components/ui/badge";
import { CONTEXT_LABELS } from "@/lib/content-labels";
import type { Project } from "@/lib/schemas/content";
import { projectHref } from "@/lib/site";
import { getTech } from "@/lib/tech";
import { ProjectCover } from "./project-cover";

const MAX_STACK = 5;

/** Card linking to a case study. The title link stretches over the card. */
export function ProjectCard({
  project,
  headingLevel = 3,
  className,
}: {
  project: Project;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const extra = project.stack.length - MAX_STACK;

  return (
    <article
      className={cn(
        "group relative isolate flex flex-col gap-5 overflow-hidden rounded-3xl border border-border glass p-3 pb-6",
        "transition-[translate,box-shadow,border-color] duration-500 ease-spring focus-within:border-border-glow hover:-translate-y-1.5 hover:border-border-glow hover:shadow-lift",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-gradient-brand after:transition-transform after:duration-500 after:ease-out-expo focus-within:after:scale-x-100 hover:after:scale-x-100",
        className,
      )}
    >
      <ProjectCover
        project={project}
        sizes="(min-width: 1280px) 26rem, (min-width: 768px) 45vw, 92vw"
      />
      <div className="flex flex-1 flex-col gap-3 px-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={project.context === "xubitar" ? "secondary" : "default"}
          >
            {CONTEXT_LABELS[project.context]}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {project.year}
          </span>
        </div>
        <Heading className="text-xl leading-snug font-semibold">
          <Link
            href={projectHref(project.slug)}
            className="rounded-sm after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="text-[0.93rem] leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <ul className="flex items-center gap-1.5" aria-label="Built with">
            {project.stack.slice(0, MAX_STACK).map((id) => (
              <li
                key={id}
                className="grid size-8 place-items-center rounded-lg border border-border bg-muted"
                title={getTech(id).label}
              >
                <TechIcon id={id} className="size-4" />
                <span className="sr-only">{getTech(id).label}</span>
              </li>
            ))}
            {extra > 0 ? (
              <li className="px-1 font-mono text-xs text-muted-foreground">
                +{extra}
              </li>
            ) : null}
          </ul>
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full border border-border-strong text-muted-foreground transition-[background-color,color,rotate] duration-300 group-hover:rotate-45 group-hover:bg-gradient-button group-hover:text-white"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
