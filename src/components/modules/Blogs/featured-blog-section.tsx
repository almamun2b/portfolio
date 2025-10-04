"use client"

import { FeaturedBlogCard } from "./featured-blog-card"
import type { Blog } from "@/lib/blog-data"

interface FeaturedBlogSectionProps {
  blogs: Blog[]
}

export function FeaturedBlogSection({ blogs }: FeaturedBlogSectionProps) {
  if (blogs.length === 0) return null
  const featuredBlog = blogs[0]

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-balance">Featured Article</h2>
      <FeaturedBlogCard
        image={featuredBlog.image}
        title={featuredBlog.title}
        description={featuredBlog.description}
        tags={featuredBlog.tags}
        category={featuredBlog.category}
        createdAt={featuredBlog.createdAt}
        publisher={featuredBlog.publisher}
        publisherAvatar={featuredBlog.publisherAvatar}
        slug={featuredBlog.slug}
      />
    </section>
  )
}
