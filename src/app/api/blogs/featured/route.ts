import { post } from "@/lib/blog-data";

export const GET = async () => {
  try {
    // Get featured blogs
    const featuredPosts = post.filter((blog) => blog.isFeatured);

    // Transform data to match Blog interface
    const blogs = featuredPosts.map((blog) => ({
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
    }));

    const response = {
      success: true,
      message: "Featured blogs fetched successfully",
      data: blogs,
    };

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
        data: [],
      },
      { status: 500 }
    );
  }
};
