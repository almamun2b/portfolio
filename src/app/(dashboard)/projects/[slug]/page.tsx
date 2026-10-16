import CreateProjectForm from "@/components/modules/Projects/CreateProjectForm";
import { getProject } from "@/lib/queries";
import { Metadata } from "next";

interface CreateProjectPageProps {
  params: Promise<{ slug: "create" | "edit" }>;
  searchParams: Promise<{ id?: string }>;
}

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Manage your projects efficiently with our intuitive project management tools.",
};

const CreateProjectPage = async ({
  params,
  searchParams,
}: CreateProjectPageProps) => {
  const { slug } = await params;
  const { id } = await searchParams;

  let project = null;

  if (slug !== "create" && slug !== "edit") {
    throw new Error("Page not found");
  } else if (slug === "edit" && !id) {
    throw new Error("Project ID is required for editing");
  } else if (slug === "edit" && id) {
    const response = await getProject(id);
    project = response?.data ?? null;
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h1 className="text-3xl font-bold">
        {slug === "create" ? "Create" : "Edit"} Project
      </h1>
      <CreateProjectForm slug={slug} project={project} />
    </div>
  );
};

export default CreateProjectPage;
