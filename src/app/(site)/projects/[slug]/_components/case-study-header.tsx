import { ArrowUpRight, ChevronRight, Code, Server } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  CATEGORY_LABELS,
  CONTEXT_LABELS,
  CONTRIBUTION_LABELS,
} from "@/lib/content-labels";
import type { Project } from "@/lib/schemas/content";

export function CaseStudyHeader({ project }: { project: Project }) {
  const { links } = project;
  return (
    <header className="relative overflow-x-clip pt-10 pb-12 sm:pt-14 sm:pb-16">
      <div
        aria-hidden="true"
        className="absolute -top-24 right-1/4 -z-10 size-[26rem] rounded-full bg-primary opacity-[0.1] blur-[70px]"
      />
      <Container className="flex flex-col gap-7">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <li>
              <Link
                href="/projects"
                className="inline-flex min-h-6 items-center rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                projects
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li aria-current="page" className="text-secondary-strong">
              {project.slug}
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={project.context === "xubitar" ? "secondary" : "default"}
            size="md"
          >
            {CONTEXT_LABELS[project.context]}
          </Badge>
          <Badge variant="outline" size="md">
            {CONTRIBUTION_LABELS[project.contribution]}
          </Badge>
          {project.categories.map((category) => (
            <Badge key={category} variant="outline" size="md">
              {CATEGORY_LABELS[category]}
            </Badge>
          ))}
        </div>

        <div className="flex max-w-4xl flex-col gap-5">
          <h1
            id="page-title"
            className="text-[clamp(2.1rem,5vw,3.75rem)] leading-[1.06] font-bold tracking-tight"
          >
            {project.title}
          </h1>
          <p className="text-[1.15rem] leading-relaxed text-foreground/90 sm:text-xl">
            {project.tagline}
          </p>
          <p className="max-w-3xl leading-[1.8] text-muted-foreground">
            {project.summary}
          </p>
        </div>

        <dl className="grid max-w-3xl grid-cols-1 gap-x-10 gap-y-4 border-y border-border py-5 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              role
            </dt>
            <dd className="font-medium">{project.role}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              year
            </dt>
            <dd className="font-medium">{project.year}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              access
            </dt>
            <dd className="font-medium">
              {links.live
                ? "Live demo"
                : links.api
                  ? "Live API"
                  : links.source
                    ? "Open source"
                    : project.context === "personal"
                      ? "Not deployed publicly"
                      : "Private client work"}
            </dd>
          </div>
        </dl>

        {links.live || links.source || links.api || links.apiSource ? (
          <div className="flex flex-wrap gap-3">
            {links.live ? (
              <ButtonLink href={links.live as `https://${string}`}>
                Visit live site <ArrowUpRight aria-hidden="true" />
              </ButtonLink>
            ) : null}
            {links.source ? (
              <ButtonLink
                href={links.source as `https://${string}`}
                variant="outline"
              >
                <Code aria-hidden="true" /> Source code
              </ButtonLink>
            ) : null}
            {links.api ? (
              <ButtonLink
                href={links.api as `https://${string}`}
                variant={links.live ? "outline" : "primary"}
              >
                Live API <ArrowUpRight aria-hidden="true" />
              </ButtonLink>
            ) : null}
            {links.apiSource ? (
              <ButtonLink
                href={links.apiSource as `https://${string}`}
                variant="outline"
              >
                <Server aria-hidden="true" /> API source
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </Container>
    </header>
  );
}
