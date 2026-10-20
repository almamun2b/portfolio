import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { pageMetadata } from "@/lib/metadata";
import { getProjectCounts, getProjects } from "@/server/dal/projects";
import { FilteredProjects } from "./_components/filtered-projects";

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
  // Cards render on the server; the client part only decides which to show
  // from ?category=, so the static HTML always lists every project.
  const items = projects.map((project) => ({
    slug: project.slug,
    categories: project.categories,
    node: <ProjectCard project={project} headingLevel={2} className="h-full" />,
  }));
  const all = (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.slug}>{item.node}</li>
      ))}
    </ul>
  );

  return (
    <>
      <PageHero
        path="projects"
        title="Things I've"
        highlight="built"
        description={`${String(counts.total)} projects: production systems from my work at Xubitar and Devxhub (client work anonymized), and personal full-stack apps you can open and try. ${String(counts.live)} have a live demo.`}
      />
      <Container className="pb-12">
        <Suspense fallback={all}>
          <FilteredProjects
            items={items}
            counts={{ all: counts.total, ...counts.byCategory }}
          />
        </Suspense>
      </Container>
    </>
  );
}
