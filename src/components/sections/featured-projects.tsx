import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { FeaturedTabs } from "./featured-tabs";
import { CATEGORY_LABELS, type ProjectCategory } from "@/lib/content-labels";
import type { Project } from "@/lib/schemas/content";

const FILTERS: ("all" | ProjectCategory)[] = [
  "all",
  "fullstack",
  "shopify",
  "automation",
];

/**
 * Selected work with category tabs. Cards are server-rendered once and
 * handed to the client tabs, which show the active category's subset.
 */
export function FeaturedProjects({
  projects,
  total,
}: {
  projects: Project[];
  total: number;
}) {
  return (
    <Section id="projects" aria-labelledby="projects-title">
      <SectionHeading
        id="projects-title"
        path="projects"
        title="Selected"
        highlight="work"
        description="Production systems I built or co-built at work, alongside personal full-stack projects you can open and use. Client work is anonymized."
        actions={
          <ButtonLink href="/projects" variant="outline">
            All {total} projects <ArrowRight aria-hidden="true" />
          </ButtonLink>
        }
      />
      <FeaturedTabs
        filters={FILTERS.map((value) => ({
          value,
          label: value === "all" ? "All" : CATEGORY_LABELS[value],
        }))}
        items={projects.map((project) => ({
          slug: project.slug,
          categories: project.categories,
          node: <ProjectCard project={project} className="h-full" />,
        }))}
      />
    </Section>
  );
}
