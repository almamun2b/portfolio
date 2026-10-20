import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { breadcrumbJsonLd, projectJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { projectHref } from "@/lib/site";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/server/dal/projects";
import { CaseStudyBody } from "./_components/case-study-body";
import { CaseStudyHeader } from "./_components/case-study-header";
import { ProjectGallery } from "./_components/project-gallery";
import { ProjectPager } from "./_components/project-pager";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: `${project.tagline} ${project.role}.`,
    path: projectHref(project.slug),
    type: "article",
  });
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const { previous, next } = await getAdjacentProjects(slug);

  return (
    <article aria-labelledby="page-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            projectJsonLd(project),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: project.title, path: projectHref(project.slug) },
            ]),
          ]),
        }}
      />
      <CaseStudyHeader project={project} />
      <Container className="flex flex-col gap-16 pb-12 sm:gap-20">
        <ProjectGallery project={project} />
        <CaseStudyBody project={project} />
        <ProjectPager previous={previous} next={next} />
      </Container>
    </article>
  );
}
