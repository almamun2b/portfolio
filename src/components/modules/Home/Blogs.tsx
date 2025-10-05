import { Button } from "@/components/ui/button";
import { BlogsResponse } from "@/types";
import Link from "next/link";
import { BlogCard } from "../Blogs/blog-card";

export const Blogs = async () => {
  // Fetch blogs from API
  const blogsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blog?limit=3&page=1`,
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
  const { data } = blogsJson as BlogsResponse;
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Latest Blogs</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Insights, tutorials, and guides from my journey.
          </p>
        </div>
        <Button variant="default" asChild>
          <Link href="/blog">See more blogs</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.posts.map((blog) => (
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
};
