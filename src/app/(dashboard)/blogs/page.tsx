import { BlogTable } from "@/components/modules/Blogs/BlogTable";
import AllListLayout from "@/components/shared/AllListLayout";
import { getBlogs } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Manage your blogs efficiently with our intuitive blog management tools.",
};

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

const BlogsPage = async ({ searchParams }: BlogPageProps) => {
  const { page, limit } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 10;

  const blogsResponse = await getBlogs({
    page: currentPage,
    limit: pageLimit,
  });
  const { posts, meta } = blogsResponse.data;

  return (
    <div className="container mx-auto py-10">
      <AllListLayout
        meta={meta}
        title="All Blogs"
        createHref="/blogs/create"
        createLabel="New Blog"
      >
        <BlogTable blogs={posts} isLoading={false} />
      </AllListLayout>
    </div>
  );
};

export default BlogsPage;
