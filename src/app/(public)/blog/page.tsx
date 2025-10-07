import { BlogPageClient } from "@/components/modules/Blogs/blog-page-client";
import { FeaturedBlogSection } from "@/components/modules/Blogs/featured-blog-section";
import { RecentBlogsSection } from "@/components/modules/Blogs/recent-blogs-section";
import { Blog, BlogsResponse, Category } from "@/types";
import type { Metadata } from "next";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read our latest articles and insights on web development, technology, and more.",
};

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const { page, category, search } = await searchParams;

  // Fetch blogs from API
  const blogsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blog?limit=6&page=${page || 1}${
      category ? `&category=${category}` : ""
    }${search ? `&search=${search}` : ""}`,
    {
      next: {
        tags: ["BLOGS"],
      },
    }
  );
  if (!blogsRes.ok) {
    throw new Error(`Failed to fetch blogs: ${blogsRes.status}`);
  }

  const blogsJson = await blogsRes.json();
  const blogsResponse = blogsJson as BlogsResponse;

  // Fetch featured blogs
  const featuredRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blog/featured`,
    {
      next: {
        tags: ["BLOGS"],
      },
    }
  );

  if (!featuredRes.ok) {
    throw new Error(`Failed to fetch featured blogs: ${featuredRes.status}`);
  }

  const featuredJson = await featuredRes.json();

  const { data: featuredBlogs } = featuredJson as { data: Blog[] };

  // Fetch popular blogs (sorted by views)
  const popularRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blog/popular`,
    {
      next: {
        tags: ["BLOGS"],
      },
    }
  );

  if (!popularRes.ok) {
    throw new Error(`Failed to fetch popular blogs: ${popularRes.status}`);
  }

  const popularJson = await popularRes.json();
  const { data: popularBlogs } = popularJson as { data: Blog[] };

  // Fetch recent blogs
  const recentRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blog?limit=3`,
    {
      next: {
        tags: ["BLOGS"],
      },
    }
  );

  if (!recentRes.ok) {
    throw new Error(`Failed to fetch recent blogs: ${recentRes.status}`);
  }

  const recentJson = await recentRes.json();
  const recentResponse = recentJson as BlogsResponse;

  // Fetch categories
  const categoriesRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/category`,
    {
      next: {
        tags: ["BLOGS"],
      },
    }
  );

  if (!categoriesRes.ok) {
    throw new Error(`Failed to fetch categories: ${categoriesRes.status}`);
  }

  const categoriesJson = await categoriesRes.json();
  const { data: categories } = categoriesJson as { data: Category[] };

  // Generate tags from all blogs
  const allTags = ["Git", "Version Control", "Automation", "Tools", "DevOps"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 pt-20">
        {/* Featured Section */}
        <FeaturedBlogSection blogs={featuredBlogs || []} />

        {/* Client Component for Interactive Features */}
        <BlogPageClient
          initialBlogs={blogsResponse?.data?.posts || []}
          initialMeta={
            blogsResponse?.data?.meta
              ? {
                  ...blogsResponse.data.meta,
                }
              : {
                  total: 0,
                  page: 1,
                  limit: 6,
                  totalPages: 0,
                }
          }
          categories={categories}
          popularBlogs={popularBlogs || []}
          allTags={allTags}
        />

        {/* Recent Blogs Section */}
        <RecentBlogsSection blogs={recentResponse?.data?.posts || []} />
      </div>
    </div>
  );
};

export default BlogPage;
