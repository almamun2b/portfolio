import { Button } from "@/components/ui/button";
import { ProjectsResponse } from "@/types";
import Link from "next/link";
import { ProjectCard } from "../Projects/ProjectCard";

export const Projects = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/project?limit=6&page=1`,
    {
      next: {
        tags: ["PROJECTS"],
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }
  const { data } = (await res.json()) as ProjectsResponse;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
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
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button variant="default" asChild>
          <Link href="/projects">See More Projects</Link>
        </Button>
      </div>
    </section>
  );
};
