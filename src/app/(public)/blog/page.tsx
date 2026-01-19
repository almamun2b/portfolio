import { BlogPageClient } from "@/components/modules/Blogs/blog-page-client";
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
  title: "Blog | Md Abdul Mamun",
  description:
    "Insightful articles on web development, modern technologies, and my professional journey as a software engineer.",
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
    },
  );
  if (!blogsRes.ok) {
    throw new Error(`Failed to fetch blogs: ${blogsRes.status}`);
  }

  const blogsJson = await blogsRes.json();
  const blogsResponse = blogsJson as BlogsResponse;

  // Fetch popular blogs (sorted by views)
  const popularRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blog/popular`,
    {
      next: {
        tags: ["BLOGS"],
      },
    },
  );

  let popularBlogs: Blog[] = [];
  if (popularRes.ok) {
    const popularJson = await popularRes.json();
    const { data } = popularJson as { data: Blog[] };
    popularBlogs = data || [];
  }

  // Fetch categories
  const categoriesRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/category`,
    {
      next: {
        tags: ["BLOGS"],
      },
    },
  );

  let categories: Category[] = [];
  if (categoriesRes.ok) {
    const categoriesJson = await categoriesRes.json();
    const { data } = categoriesJson as { data: Category[] };
    categories = data || [];
  }

  const allTags = [
    "React",
    "Next.js",
    "TypeScript",
    "Performance",
    "Clean Code",
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] opacity-30 -z-20" />

        <div className="container mx-auto px-6 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
            The Journal
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Design, Tech &{" "}
            <span className="text-primary text-glow">Insights</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of modern web development, engineering
            practices, and digital craftsmanship.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container mx-auto px-6">
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
            popularBlogs={popularBlogs}
            allTags={allTags}
          />
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
