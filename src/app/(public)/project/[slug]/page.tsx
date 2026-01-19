import ProjectDetailContent from "@/components/modules/Projects/ProjectDetailContent";
import { ProjectDetailHeader } from "@/components/modules/Projects/ProjectDetailHeader";
import { Button } from "@/components/ui/button";
import { ProjectsResponse, SingleProjectResponse } from "@/types";
import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project`);
  const { data } = (await res.json()) as ProjectsResponse;

  return data.projects.map((project) => ({
    slug: project.slug,
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
  );

  const { data: project } = (await res.json()) as SingleProjectResponse;

  return {
    title: `${project?.title} | Project Detail`,
    description: project?.description,
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/${slug}`,
    );

    if (!res.ok) {
      notFound();
    }

    const { data: project } = (await res.json()) as SingleProjectResponse;

    if (!project) {
      notFound();
    }

    return (
      <main className="min-h-screen relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-6 pt-32 pb-24">
          {/* Breadcrumbs / Navigation */}
          <nav className="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:text-primary transition-colors"
              >
                <Home size={18} />
              </Button>
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <Link href="/project">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:text-primary transition-colors font-bold"
              >
                Projects
              </Button>
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="text-sm font-bold text-primary truncate max-w-[200px]">
              {project.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Project Header & Visuals */}
            <div className="lg:col-span-12 space-y-12">
              <ProjectDetailHeader project={project} />

              <div className="w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />

              <ProjectDetailContent project={project} />
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-24 pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <Link href="/project">
              <Button
                variant="outline"
                className="rounded-2xl border-2 px-8 h-14 font-bold group"
              >
                <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to All Projects
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    notFound();
  }
};

export default ProjectDetailPage;
