import { BlogPageClient } from "@/components/modules/Blogs/blog-page-client";
import { getBlogs, getCategories, getPopularBlogs } from "@/lib/queries";
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

export const dynamic = "force-dynamic";

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const { page, category, search } = await searchParams;

  const [blogsResponse, popularBlogs, categoriesResponse] = await Promise.all([
    getBlogs({ limit: 6, page: Number(page) || 1, category, search }),
    getPopularBlogs(),
    getCategories(),
  ]);

  const categories = categoriesResponse.data;

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
