import ProjectDetailContent from "@/components/modules/Projects/ProjectDetailContent";
import { ProjectDetailHeader } from "@/components/modules/Projects/ProjectDetailHeader";
import { Button } from "@/components/ui/button";
import { ProjectsResponse, SingleProjectResponse } from "@/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project`);
  const { data } = (await res.json()) as ProjectsResponse;

  return data.projects.map((blog) => ({
    slug: String(blog.slug),
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/project/${slug}`,
    {
      cache: "no-store",
    }
  );

  const { data: project } = (await res.json()) as SingleProjectResponse;

  return {
    title: project?.title,
    description: project?.description,
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      notFound();
    }

    const { data: project } = (await res.json()) as SingleProjectResponse;

    if (!project) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pt-20">
          {/* Back Button */}
          <Link href="/project">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Project Content */}
            <article className="lg:col-span-12">
              <ProjectDetailHeader project={project} />
              <div className="mt-8">
                <ProjectDetailContent project={project} />
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    notFound();
  }
};

export default ProjectDetailPage;
