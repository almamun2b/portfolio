import type { Blog } from "@/types";
import { FeaturedBlogCard } from "./featured-blog-card";

interface FeaturedBlogSectionProps {
  blogs: Blog[];
}

export function FeaturedBlogSection({ blogs }: FeaturedBlogSectionProps) {
  if (blogs.length === 0) return null;
  const featuredBlog = blogs[0];

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-balance">Featured Article</h2>
      <FeaturedBlogCard
        image={featuredBlog.image || "/images/mamun.png"}
        title={featuredBlog.title}
        description={featuredBlog.description}
        tags={featuredBlog.tags}
        category={featuredBlog.category.name}
        createdAt={new Date(featuredBlog.createdAt).toLocaleDateString()}
        publisher={featuredBlog.author?.name || "Unknown"}
        publisherAvatar={featuredBlog.author?.picture || "/images/mamun.png"}
        slug={featuredBlog.slug}
      />
    </section>
  );
}
