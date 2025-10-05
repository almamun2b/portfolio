import { post } from "@/lib/blog-data";

export const GET = async () => {
  try {
    // Extract unique categories from blog tags
    const allTags = post.flatMap((blog) => blog.tags);
    const uniqueTags = [...new Set(allTags)];

    // Create category objects
    const categories = uniqueTags.map((tag, index) => ({
      id: index + 1,
      name: tag,
      slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const response = {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
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
