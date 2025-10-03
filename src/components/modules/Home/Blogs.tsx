"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogCard } from "../Blogs/BlogCard";

interface Blog {
  image?: string;
  title: string;
  description: string;
  tags?: string[];
  category: string;
  createdAt: string;
  slug: string;
  publisher: string;
  publisherAvatar?: string;
}

const blogs: Blog[] = [
  {
    title: "Building Modern Web Apps with Next.js 15",
    description:
      "Learn how to leverage Next.js 15 features to build fast and scalable web applications.",
    tags: ["Next.js", "React", "Web Development"],
    category: "Frontend",
    createdAt: "Sep 30, 2025",
    slug: "/blogs/nextjs-15",
    publisher: "Mamun",
    publisherAvatar: "/images/mamun.png",
  },
  {
    title: "Backend API Design with Node.js & Express",
    description:
      "A guide to designing RESTful APIs using Node.js and Express with best practices.",
    tags: ["Node.js", "Express", "API"],
    category: "Backend",
    createdAt: "Sep 25, 2025",
    slug: "/blogs/nodejs-api",
    publisher: "Mamun",
    publisherAvatar: "/images/mamun.png",
  },
  {
    title: "Creating Scalable Databases with MongoDB & Prisma",
    description:
      "Tips and techniques for designing scalable and efficient database schemas.",
    tags: ["MongoDB", "Prisma", "Database"],
    category: "Full Stack",
    createdAt: "Sep 20, 2025",
    slug: "/blogs/databases",
    publisher: "Mamun",
    publisherAvatar: "/images/mamun.png",
  },
  {
    title: "Optimizing Frontend Performance",
    description:
      "How to optimize your frontend apps for speed and better user experience.",
    tags: ["Performance", "Frontend", "Optimization"],
    category: "Frontend",
    createdAt: "Sep 18, 2025",
    slug: "/blogs/frontend-performance",
    publisher: "Mamun",
    publisherAvatar: "/images/mamun.png",
  },
  {
    title: "Building a Personal Portfolio Website",
    description:
      "Step-by-step guide to building a portfolio website with modern frameworks and Shadcn UI.",
    tags: ["Portfolio", "Next.js", "UI"],
    category: "Frontend",
    createdAt: "Sep 10, 2025",
    slug: "/blogs/portfolio-website",
    publisher: "Mamun",
    publisherAvatar: "/images/mamun.png",
  },
  {
    title: "Authentication & Authorization Best Practices",
    description:
      "Secure your applications with proper authentication and role-based authorization techniques.",
    tags: ["Auth", "Security", "Backend"],
    category: "Backend",
    createdAt: "Sep 5, 2025",
    slug: "/blogs/auth-best-practices",
    publisher: "Mamun",
    publisherAvatar: "/images/mamun.png",
  },
];

export const Blogs: React.FC = () => {
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
          <Link href="/blogs">See more blogs</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.title} {...blog} />
        ))}
      </div>
    </section>
  );
};
