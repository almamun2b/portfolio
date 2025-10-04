import { BlogCard } from "@/components/modules/Blogs/blog-card";
import type { Blog } from "@/lib/blog-data";

interface RelatedBlogsSectionProps {
  blogs: Blog[];
}

export function RelatedBlogsSection({ blogs }: RelatedBlogsSectionProps) {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t">
      <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
