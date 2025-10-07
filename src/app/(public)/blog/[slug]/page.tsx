import mamun from "@/assets/mamun.png";
import { BlogDetailContent } from "@/components/modules/Blogs/blog-detail-content";
import { BlogDetailHeader } from "@/components/modules/Blogs/blog-detail-header";
import { PopularBlogsSidebar } from "@/components/modules/Blogs/popular-blogs-sidebar";
import { RelatedBlogsSection } from "@/components/modules/Blogs/related-blogs-section";
import { Button } from "@/components/ui/button";
import { Blog, BlogsResponse, SingleBlogResponse } from "@/types";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`);

  const { data: blogs } = (await res.json()) as BlogsResponse;

  return blogs.posts.slice(0, 3).map((blog) => ({
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
      description: "The requested blog post could not be found.",
    };
  }

  const blogResponse = (await res.json()) as SingleBlogResponse;

  return {
    title: blogResponse.data?.title,
    description: blogResponse.data?.description,
  };
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  try {
    // Fetch single blog
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${slug}`);

    if (!res.ok) {
      notFound();
    }

    const blogResponse = (await res.json()) as SingleBlogResponse;
    const blog = blogResponse.data;

    if (!blog) {
      notFound();
    }

    // Fetch popular blogs
    const popularRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blog/popular`,
      {
        next: {
          tags: ["BLOGS"],
        },
      }
    );

    let popularBlogs: Blog[] = [];
    if (popularRes.ok) {
      const popularJson = await popularRes.json();
      const { data } = popularJson as { data: Blog[] };
      popularBlogs = data || [];
    }

    // Fetch related blogs (same category)
    const relatedRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blog?category=${blog.category.slug}&limit=3`,
      {
        next: {
          tags: ["BLOGS"],
        },
      }
    );

    let relatedBlogs: Blog[] = [];
    if (relatedRes.ok) {
      const relatedJson = await relatedRes.json();
      const relatedResponse = relatedJson as BlogsResponse;
      relatedBlogs =
        relatedResponse.data.posts.filter((b) => b.id !== blog.id) || [];
    }

    // Static tags
    const allTags = ["Git", "Version Control", "Automation", "Tools", "DevOps"];

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 pt-20">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article Content */}
            <article className="lg:col-span-8">
              <BlogDetailHeader
                blog={{
                  ...blog,
                  publisher: blog.author?.name || "Unknown",
                  publisherAvatar: blog.author?.picture || mamun.src,
                }}
              />
              <div className="mt-8">
                <BlogDetailContent
                  image={blog.image || mamun.src}
                  title={blog.title}
                  description={blog.description}
                />
              </div>
              <RelatedBlogsSection
                blogs={relatedBlogs.map((b) => ({
                  ...b,
                  publisher: b.author?.name || "Unknown",
                  publisherAvatar: b.author?.picture || mamun.src,
                }))}
              />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-20">
                <PopularBlogsSidebar
                  popularBlogs={popularBlogs}
                  tags={allTags}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    notFound();
  }
}
