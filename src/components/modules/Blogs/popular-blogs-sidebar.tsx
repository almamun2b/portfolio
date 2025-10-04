"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Blog } from "@/lib/blog-data";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PopularBlogsSidebarProps {
  popularBlogs: Blog[];
  tags: { name: string; count: number }[];
}

export function PopularBlogsSidebar({
  popularBlogs,
  tags,
}: PopularBlogsSidebarProps) {
  const topThreeBlogs = popularBlogs.slice(0, 3);

  return (
    <aside className="space-y-6">
      {/* Popular Blogs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Most Popular</CardTitle>
          <Badge variant="secondary" className="w-fit mt-2">
            Technology
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topThreeBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="flex gap-3 group hover:bg-muted p-2 rounded-md transition-colors"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{blog.views.toLocaleString()} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.name}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
