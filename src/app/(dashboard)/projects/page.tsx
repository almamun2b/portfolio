// import { ProjectsTable } from "@/components/modules/Projects/ProjectsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Manage your projects efficiently with our intuitive project management tools.",
};

const ProjectPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project`, {
    next: {
      tags: ["PROJECTS"],
    },
  });
  const { data } = await res.json();

  console.log("data:", data);

  return (
    <div className="container mx-auto py-10">
      {/* <ProjectsTable projects={data} /> */}
    </div>
  );
};

export default ProjectPage;
