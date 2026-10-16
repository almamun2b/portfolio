import { ProjectsTable } from "@/components/modules/Projects/ProjectsTable";
import AllListLayout from "@/components/shared/AllListLayout";
import { getProjects } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Manage your projects efficiently with our intuitive project management tools.",
};

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

const ProjectPage = async ({ searchParams }: ProjectPageProps) => {
  const { page, limit } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 10;

  const projectsResponse = await getProjects({
    page: currentPage,
    limit: pageLimit,
  });
  const { projects, meta } = projectsResponse.data;

  return (
    <div className="container mx-auto py-10">
      <AllListLayout
        meta={meta}
        title="All Projects"
        createHref="/projects/create"
        createLabel="New Project"
      >
        <ProjectsTable projects={projects} isLoading={false} />
      </AllListLayout>
    </div>
  );
};

export default ProjectPage;
