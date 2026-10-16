import CreateBlogForm from "@/components/modules/Blogs/CreateBlogForm";
import { getBlog, getCategories } from "@/lib/queries";
import { Category } from "@/types";
import { Metadata } from "next";

interface CreateBlogPageProps {
  params: Promise<{ slug: "create" | "edit" }>;
  searchParams: Promise<{ id?: string }>;
}

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Manage your blogs efficiently with our intuitive blog management tools.",
};

const CreateBlogPage = async ({
  params,
  searchParams,
}: CreateBlogPageProps) => {
  const { slug } = await params;
  const { id } = await searchParams;

  let blog = null;
  let categories: Category[] = [];

  if (slug !== "create" && slug !== "edit") {
    throw new Error("Page not found");
  } else if (slug === "edit" && !id) {
    throw new Error("Blog ID is required for editing");
  } else if (slug === "edit" && id) {
    const response = await getBlog(id);
    blog = response?.data ?? null;
  }

  // Fetch categories for the dropdown
  const categoriesResponse = await getCategories();
  categories = categoriesResponse.data;

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h1 className="text-3xl font-bold">
        {slug === "create" ? "Create" : "Edit"} Blog
      </h1>
      <CreateBlogForm slug={slug} blog={blog} categories={categories} />
    </div>
  );
};

export default CreateBlogPage;
