import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/effects/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";
import {
  CATEGORY_LABELS,
  type Project,
  type ProjectCategory,
} from "@/lib/schemas/content";

const FILTERS: ("all" | ProjectCategory)[] = [
  "all",
  "fullstack",
  "shopify",
  "automation",
];

/**
 * Selected work with category tabs. Cards are server-rendered into every
 * panel, so the markup is complete without JS; tabs only switch visibility.
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
      <Tabs defaultValue="all" className="mt-12 flex flex-col gap-8">
        <TabsList label="Filter selected work">
          {FILTERS.map((filter) => (
            <TabsTrigger key={filter} value={filter}>
              {filter === "all" ? "All" : CATEGORY_LABELS[filter]}
            </TabsTrigger>
          ))}
        </TabsList>
        {FILTERS.map((filter) => {
          const list =
            filter === "all"
              ? projects
              : projects.filter((p) => p.categories.includes(filter));
          return (
            <TabsPanel key={filter} value={filter}>
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {list.map((project, i) => (
                  <Reveal as="li" key={project.slug} index={i % 3}>
                    <ProjectCard project={project} className="h-full" />
                  </Reveal>
                ))}
              </ul>
            </TabsPanel>
          );
        })}
      </Tabs>
    </Section>
  );
}
