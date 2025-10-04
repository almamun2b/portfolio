"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Blog } from "@/lib/blog-data";
import { Search } from "lucide-react";
import { BlogCard } from "./blog-card";
import PaginationCommon from "./pagination-common";

interface BlogGridProps {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  searchQuery: string;
  onSearchTextChange: (query: string) => void;
  onSearch: () => void;
}

export function BlogGrid({
  blogs,
  currentPage,
  totalPages,
  itemsPerPage = 6,
  searchQuery,
  onSearchTextChange,
  onSearch,
}: BlogGridProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedBlogs = blogs.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">All Articles</h2>
        <div className="flex gap-2 max-w-md flex-1">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => onSearchTextChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="flex-1"
          />
          <Button size="icon" onClick={onSearch}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      {displayedBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No articles found. Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              image={blog.image}
              title={blog.title}
              description={blog.description}
              tags={blog.tags}
              category={blog.category}
              createdAt={blog.createdAt}
              publisher={blog.publisher}
              publisherAvatar={blog.publisherAvatar}
              slug={blog.slug}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <PaginationCommon
            currentPage={currentPage}
            totalPages={totalPages}
            paginationItemsToDisplay={5}
          />
        </div>
      )}
    </div>
  );
}
