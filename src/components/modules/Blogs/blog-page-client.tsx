"use client";

import { BlogGrid } from "@/components/modules/Blogs/blog-grid";
import { CategoriesSidebar } from "@/components/modules/Blogs/categories-sidebar";
import { PopularBlogsSidebar } from "@/components/modules/Blogs/popular-blogs-sidebar";
import { Blog, Category } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface BlogPageClientProps {
  initialBlogs: Blog[];
  initialMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  categories?: Category[];
  popularBlogs: Blog[];
  allTags?: string[];
}

export function BlogPageClient({
  initialBlogs,
  initialMeta,
  categories,
  popularBlogs,
  allTags,
}: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  // const [, setActiveSearchQuery] = useState(searchParams.get("search") || "");

  const currentPage = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = initialMeta.limit;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL({ category, page: "1" });
  };

  const handleSearch = () => {
    // setActiveSearchQuery(searchQuery);
    updateURL({ search: searchQuery, page: "1" });
  };

  const onSearchTextChange = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      // setActiveSearchQuery("");
      updateURL({ search: "", page: "1" });
    }
  };

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All" && value !== "") {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    router.push(newURL);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Blog Grid - Now Full Width */}
          <div className="lg:col-span-9">
            <BlogGrid
              blogs={initialBlogs}
              currentPage={currentPage}
              totalPages={initialMeta.totalPages}
              itemsPerPage={itemsPerPage}
              searchQuery={searchQuery}
              onSearchTextChange={onSearchTextChange}
              onSearch={handleSearch}
            />
          </div>

          {/* Right Sidebar - Categories, Popular & Tags */}
          <div className="lg:col-span-3 space-y-6">
            {/* Categories at the top */}
            <CategoriesSidebar
              categories={categories || []}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Popular Blogs & Tags below */}
            <PopularBlogsSidebar popularBlogs={popularBlogs} tags={allTags} />
          </div>
        </div>
      </div>
    </div>
  );
}
