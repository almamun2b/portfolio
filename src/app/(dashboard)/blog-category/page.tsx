import { BlogCategoryTable } from "@/components/modules/Blogs/BlogCategoryTable";
import AllListLayout from "@/components/shared/AllListLayout";
import { getCategories } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Categories",
  description:
    "Manage your blog categories efficiently with our intuitive category management tools.",
};

export const dynamic = "force-dynamic";

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

  const categoriesResponse = await getCategories();
  const categories = categoriesResponse.data;

  // Create a mock meta object since categories aren't paginated
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
