"use client";

import { BlogGrid } from "@/components/modules/Blogs/blog-grid";
import { CategoriesSidebar } from "@/components/modules/Blogs/categories-sidebar";
import { FeaturedBlogSection } from "@/components/modules/Blogs/featured-blog-section";
import { PopularBlogsSidebar } from "@/components/modules/Blogs/popular-blogs-sidebar";
import { RecentBlogsSection } from "@/components/modules/Blogs/recent-blogs-section";
import {
  allTags,
  categories,
  getFeaturedBlogs,
  getPopularBlogs,
  getRecentBlogs,
  mockBlogs,
  searchBlogs,
} from "@/lib/blog-data";
import { useMemo, useState } from "react";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const featuredBlogs = getFeaturedBlogs();
  const popularBlogs = getPopularBlogs(5);
  const recentBlogs = getRecentBlogs(3);

  // Filter blogs based on category and search
  const filteredBlogs = useMemo(() => {
    let blogs = mockBlogs;

    // Apply search filter
    if (activeSearchQuery) {
      blogs = searchBlogs(activeSearchQuery);
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      blogs = blogs.filter((blog) => blog.category === selectedCategory);
    }

    return blogs;
  }, [selectedCategory, activeSearchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const onSearchTextChange = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setActiveSearchQuery("");
      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Featured Section */}
        <FeaturedBlogSection blogs={featuredBlogs} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Blog Grid - Now Full Width */}
          <div className="lg:col-span-9">
            <BlogGrid
              blogs={filteredBlogs}
              currentPage={currentPage}
              totalPages={totalPages}
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
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Popular Blogs & Tags below */}
            <PopularBlogsSidebar popularBlogs={popularBlogs} tags={allTags} />
          </div>
        </div>

        {/* Recent Blogs Section */}
        <RecentBlogsSection blogs={recentBlogs} />
      </div>
    </div>
  );
}
