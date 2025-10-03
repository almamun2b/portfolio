/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogCard from "@/components/modules/BlogsOld/BlogCardOld";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Blogs | Next Blog",
  description: "All blogs of Next Blog",
};

const AllBlogsPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/post`, {
    cache: "no-store", // SSR
  });
  const { data: blogs } = await res.json();
  return (
    <div className="py-30 px-4 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl">All Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mt-5">
        {blogs?.map((blog: any) => (
          <BlogCard key={blog.id} post={blog} />
        ))}
      </div>
    </div>
  );
};

export default AllBlogsPage;
