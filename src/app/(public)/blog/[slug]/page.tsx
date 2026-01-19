import mamun from "@/assets/mamun.png";
import { BlogDetailContent } from "@/components/modules/Blogs/blog-detail-content";
import { BlogDetailHeader } from "@/components/modules/Blogs/blog-detail-header";
import { PopularBlogsSidebar } from "@/components/modules/Blogs/popular-blogs-sidebar";
import { RelatedBlogsSection } from "@/components/modules/Blogs/related-blogs-section";
import { Button } from "@/components/ui/button";
import { Blog, BlogsResponse, SingleBlogResponse } from "@/types";
import { ChevronLeft, Home } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`);
  const { data: blogs } = (await res.json()) as BlogsResponse;

  return blogs.posts.slice(0, 5).map((blog) => ({
    slug: blog.slug,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${slug}`);

  if (!res.ok) {
    return {
      title: "Blog Not Found",
    };
  }

  const blogResponse = (await res.json()) as SingleBlogResponse;

  return {
    title: `${blogResponse.data?.title} | Journal`,
    description: blogResponse.data?.description,
  };
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${slug}`);

    if (!res.ok) {
      notFound();
    }

    const blogResponse = (await res.json()) as SingleBlogResponse;
    const blog = blogResponse.data;

    if (!blog) {
      notFound();
    }

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

    const relatedRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blog?category=${blog.category.slug}&limit=3`,
      {
        next: {
          tags: ["BLOGS"],
        },
      },
    );

    let relatedBlogs: Blog[] = [];
    if (relatedRes.ok) {
      const relatedJson = await relatedRes.json();
      const relatedResponse = relatedJson as BlogsResponse;
      relatedBlogs =
        relatedResponse.data.posts.filter((b) => b.id !== blog.id) || [];
    }

    const allTags = ["Engineering", "Design", "Productivity", "Tech Stack"];

    return (
      <main className="min-h-screen relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-6 pt-32 pb-24">
          {/* Enhanced Breadcrumbs */}
          <nav className="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:text-primary transition-colors"
              >
                <Home size={18} />
              </Button>
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <Link href="/blog">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:text-primary transition-colors font-bold"
              >
                Journal
              </Button>
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="text-sm font-bold text-primary truncate max-w-[200px]">
              {blog.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Article Content */}
            <article className="lg:col-span-8 space-y-12">
              <BlogDetailHeader
                blog={{
                  ...blog,
                  publisher: blog.author?.name || "Admin",
                  publisherAvatar: blog.author?.picture || mamun.src,
                }}
              />

              <div className="w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />

              <BlogDetailContent
                image={blog.image || mamun.src}
                title={blog.title}
                description={blog.description}
              />

              <div className="pt-20">
                <RelatedBlogsSection
                  blogs={relatedBlogs.map((b) => ({
                    ...b,
                    publisher: b.author?.name || "Admin",
                    publisherAvatar: b.author?.picture || mamun.src,
                  }))}
                />
              </div>
            </article>

            {/* Premium Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="sticky top-28">
                <PopularBlogsSidebar
                  popularBlogs={popularBlogs}
                  tags={allTags}
                />
              </div>
            </aside>
          </div>

          {/* Footer Navigation */}
          <div className="mt-24 pt-12 border-t border-border/50">
            <Link href="/blog">
              <Button
                variant="outline"
                className="rounded-2xl border-2 px-8 h-14 font-bold group"
              >
                <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Explore More Articles
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    notFound();
  }
}
