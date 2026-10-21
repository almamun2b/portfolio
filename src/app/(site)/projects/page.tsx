import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { pageMetadata } from "@/lib/metadata";
import { getProjectCounts, getProjects } from "@/server/dal/projects";
import {
  PROJECT_LIST_ID,
  ProjectFilter,
  ProjectFilterNav,
} from "./_components/filtered-projects";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Full-stack apps, Shopify apps, automation pipelines, and frontend work by Md Abdul Mamun, with screenshots and case studies.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [projects, counts] = await Promise.all([
    getProjects(),
    getProjectCounts(),
  ]);
  const filterCounts = { all: counts.total, ...counts.byCategory };
  return (
    <>
      <PageHero
        path="projects"
        title="Things I've"
        highlight="built"
        description={`${String(counts.total)} projects: production systems from my work at Xubitar and Devxhub (client work anonymized), and personal full-stack apps you can open and try. ${String(counts.live)} have a live demo.`}
      />
      <Container className="pb-12">
        <div className="flex flex-col gap-8">
          {/* The filter reads ?category=, so it renders on the client; its
              fallback is the same nav with "All" selected. */}
          <Suspense
            fallback={<ProjectFilterNav active="all" counts={filterCounts} />}
          >
            <ProjectFilter counts={filterCounts} />
          </Suspense>
          {/* Rendered once, on the server: every card is in the static HTML.
              The filter hides cards with CSS through data-filter. */}
          <ul
            id={PROJECT_LIST_ID}
            data-filter="all"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {projects.map((project) => (
              <li
                key={project.slug}
                data-categories={project.categories.join(" ")}
              >
                <ProjectCard
                  project={project}
                  headingLevel={2}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
