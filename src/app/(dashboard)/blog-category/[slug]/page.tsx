import CreateCategoryForm from "@/components/modules/Blogs/CreateCategoryForm";
import { SingleCategoryResponse } from "@/types";
import { Metadata } from "next";

interface CreateBlogCategoryPageProps {
  params: Promise<{ slug: "create" | "edit" }>;
  searchParams: Promise<{ id?: string }>;
}

export const metadata: Metadata = {
  title: "Blog Categories",
  description:
    "Manage your blog categories efficiently with our intuitive category management tools.",
};

const CreateBlogCategoryPage = async ({
  params,
  searchParams,
}: CreateBlogCategoryPageProps) => {
  const { slug } = await params;
  const { id } = await searchParams;

  let category = null;

  if (slug !== "create" && slug !== "edit") {
    throw new Error("Page not found");
  } else if (slug === "edit" && !id) {
    throw new Error("Category ID is required for editing");
  } else if (slug === "edit" && id) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/category/${id}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch category");
    }
    const { data } = (await res.json()) as SingleCategoryResponse;
    category = data;
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h1 className="text-3xl font-bold">
        {slug === "create" ? "Create" : "Edit"} Category
      </h1>
      <CreateCategoryForm slug={slug} category={category} />
    </div>
  );
};

export default CreateBlogCategoryPage;
