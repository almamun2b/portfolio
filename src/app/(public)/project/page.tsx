import { ProjectCard } from "@/components/modules/Projects/ProjectCard";
import PaginationCommon from "@/components/shared/pagination-common";
import { ProjectsResponse } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

interface ProjectPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Manage your projects efficiently with our intuitive project management tools.",
};

const ProjectPage = async ({ searchParams }: ProjectPageProps) => {
  const { page } = await searchParams;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/project?limit=6&page=${page || 1}`,
    {
      next: {
        tags: ["PROJECTS"],
      },
    }
  );
  const { data } = (await res.json()) as ProjectsResponse;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 pt-32">
      <h2 className="text-3xl font-bold mb-4 text-center">My Projects</h2>
      <p className="text-muted-foreground mb-10 text-center">
        Here are some of the projects I`ve worked on. You can check out more on
        my{" "}
        <Link href="/projects" className="text-primary hover:underline">
          Projects
        </Link>{" "}
        page.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {data.meta.totalPages > 1 && (
        <div className="mt-10 text-center">
          <PaginationCommon
            currentPage={data.meta.page}
            totalPages={data.meta.totalPages}
          />
        </div>
      )}
    </section>
  );
};

export default ProjectPage;
