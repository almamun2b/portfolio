import CreateBlogForm from "@/components/modules/Blogs/CreateBlogForm";
import { CategoriesResponse, Category, SingleBlogResponse } from "@/types";
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }
    const { data } = (await res.json()) as SingleBlogResponse;
    blog = data;
  }

  // Fetch categories for the dropdown
  const categoriesRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/category`
  );
  if (categoriesRes.ok) {
    const categoriesResponse =
      (await categoriesRes.json()) as CategoriesResponse;
    categories = categoriesResponse.data;
  }

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
