import { BlogDetailContent } from "@/components/modules/Blogs/blog-detail-content";
import { BlogDetailHeader } from "@/components/modules/Blogs/blog-detail-header";
import { PopularBlogsSidebar } from "@/components/modules/Blogs/popular-blogs-sidebar";
import { RelatedBlogsSection } from "@/components/modules/Blogs/related-blogs-section";
import { Button } from "@/components/ui/button";
import {
  allTags,
  getBlogBySlug,
  getPopularBlogs,
  getRelatedBlogs,
} from "@/lib/blog-data";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = getRelatedBlogs(blog.id, blog.category, 3);
  const popularBlogs = getPopularBlogs(5);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8 -ml-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-8">
            <BlogDetailHeader blog={blog} />
            <div className="mt-8">
              <BlogDetailContent
                image={blog.image}
                title={blog.title}
                description={blog.description}
              />
            </div>
            <RelatedBlogsSection blogs={relatedBlogs} />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20">
              <PopularBlogsSidebar popularBlogs={popularBlogs} tags={allTags} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
