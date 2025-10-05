import { BlogCategoryTable } from "@/components/modules/Blogs/BlogCategoryTable";
import AllListLayout from "@/components/shared/AllListLayout";
import { CategoriesResponse } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Categories",
  description:
    "Manage your blog categories efficiently with our intuitive category management tools.",
};

interface BlogCategoryPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

const BlogsCategoryPage = async ({ searchParams }: BlogCategoryPageProps) => {
  const { page, limit } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 10;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/category?page=${currentPage}&limit=${pageLimit}`,
    {
      next: {
        tags: ["CATEGORIES"],
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  const categoriesResponse = (await res.json()) as CategoriesResponse;
  const categories = categoriesResponse.data;

  // Create a mock meta object since the API doesn't provide pagination info for categories
  const meta = {
    page: currentPage,
    limit: pageLimit,
    total: categories.length,
    totalPages: Math.ceil(categories.length / pageLimit),
  };

  return (
    <div className="container mx-auto py-10">
      <AllListLayout
        meta={meta}
        title="All Blog Categories"
        createHref="/blog-category/create"
        createLabel="New Category"
      >
        <BlogCategoryTable categories={categories} isLoading={false} />
      </AllListLayout>
    </div>
  );
};

export default BlogsCategoryPage;
