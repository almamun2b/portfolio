import { post } from "@/lib/blog-data";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params;

    // Find blog by slug
    const blog = post.find((p) => {
      const blogSlug = p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return blogSlug === slug;
    });

    if (!blog) {
      return Response.json(
        {
          success: false,
          message: "Blog not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Transform data to match Blog interface
    const transformedBlog = {
      id: blog.id,
      title: blog.title,
      slug: blog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      description: blog.content.substring(0, 200) + "...",
      content: blog.content,
      image: blog.thumbnail,
      isFeatured: blog.isFeatured,
      category: blog.tags[0] || "General",
      tags: blog.tags,
      views: blog.views,
      authorId: blog.authorId,
      createdAt: new Date(blog.createdAt),
      updatedAt: new Date(blog.updatedAt),
      author: blog.author,
    };

    const response = {
      success: true,
      message: "Blog fetched successfully",
      data: transformedBlog,
    };

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
};
