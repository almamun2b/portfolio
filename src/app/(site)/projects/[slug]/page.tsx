import { slugParams } from "@/lib/static-params";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { breadcrumbJsonLd, projectJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { projectHref } from "@/lib/site";
import { getProjectCategories } from "@/server/modules/content/categories.service";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/server/modules/content/projects.service";
import { CaseStudyBody } from "./_components/case-study-body";
import { CaseStudyHeader } from "./_components/case-study-header";
import { ProjectGallery } from "./_components/project-gallery";
import { ProjectPager } from "./_components/project-pager";

// Unknown slugs render on request and fall through to notFound() below.
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugParams(slugs);
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  // A real 404 status for unknown or unpublished slugs, decided before the
  // page body streams.
  if (!project) notFound();
  return pageMetadata({
    title: project.title,
    description: `${project.tagline} ${project.role}.`,
    path: projectHref(project.slug),
    type: "article",
  });
}

// The param-dependent body sits behind <Suspense>: for a slug that wasn't
// known at build time (a project published since), the app shell prerenders
// without it and the case study fills in on the first visit. Slugs known at
// build time render fully into the static HTML.
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={null}>
      <ProjectArticle params={params} />
    </Suspense>
  );
}

async function ProjectArticle({
  params,
}: {
  params: PageProps<"/projects/[slug]">["params"];
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const { previous, next } = await getAdjacentProjects(slug);
  const categories = await getProjectCategories();

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
      <CaseStudyHeader project={project} categories={categories} />
      <Container className="flex flex-col gap-16 pb-12 sm:gap-20">
        <ProjectGallery project={project} />
        <CaseStudyBody project={project} />
        <ProjectPager previous={previous} next={next} />
      </Container>
    </article>
  );
}
