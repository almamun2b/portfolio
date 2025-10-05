import type { Blog } from "@/types";
import { BlogCard } from "./blog-card";

interface RecentBlogsSectionProps {
  blogs: Blog[];
}

export function RecentBlogsSection({ blogs }: RecentBlogsSectionProps) {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold mb-6 text-balance">Recent Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            image={blog.image}
            title={blog.title}
            description={blog.description}
            tags={blog.tags}
            category={blog.category}
            createdAt={blog.createdAt}
            author={blog.author}
            slug={blog.slug}
          />
        ))}
      </div>
    </section>
  );
}
