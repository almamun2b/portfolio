import { ProjectCard } from "@/components/modules/Projects/ProjectCard";
import PaginationCommon from "@/components/shared/pagination-common";
import { ProjectsResponse } from "@/types";
import type { Metadata } from "next";

interface ProjectPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Projects | Md Abdul Mamun",
  description:
    "Explore a curated collection of my latest work, from full-stack applications to interactive frontend experiences.",
};

const ProjectPage = async ({ searchParams }: ProjectPageProps) => {
  const { page } = await searchParams;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/project?limit=6&page=${page || 1}`,
    {
      next: {
        tags: ["PROJECTS"],
      },
    },
  );
  const { data } = (await res.json()) as ProjectsResponse;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] opacity-30 -z-20" />

        <div className="container mx-auto px-6 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
            Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            My Creative <span className="text-primary">Projects</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive showcase of my technical expertise, ranging from
            complex full-stack solutions to meticulously crafted user
            interfaces.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-32 pt-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {data.projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          {data.meta.totalPages > 1 && (
            <div className="mt-20 flex justify-center">
              <PaginationCommon
                currentPage={data.meta.page}
                totalPages={data.meta.totalPages}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProjectPage;
