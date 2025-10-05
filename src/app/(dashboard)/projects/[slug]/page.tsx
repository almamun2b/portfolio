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

  if (slug !== "create" && slug !== "edit") {
    throw new Error("Page not found");
  } else if (slug === "edit" && !id) {
    throw new Error("Project ID is required for editing");
  } else if (slug === "create") {
    // Logic for creating a new project can be added here
  } else if (slug === "edit" && id) {
    // Logic for editing an existing project can be added here
  } else {
    throw new Error("Invalid request");
  }

  return (
    <div>
      CreateProjectPage {slug} params {id}
    </div>
  );
};

export default CreateProjectPage;
