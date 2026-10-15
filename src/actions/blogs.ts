"use server";

import { CreateBlogFormTypes } from "@/components/modules/Blogs/CreateBlogForm";
import { getUserSession } from "@/helpers/getUserSession";
import {
  createBlogRecord,
  deleteBlogRecord,
  updateBlogRecord,
} from "@/lib/queries";
import { revalidateTag } from "next/cache";

const toTagsArray = (tags: string | string[]) =>
  (Array.isArray(tags) ? tags : tags.split(","))
    .map((tag: string) => tag.trim())
    .filter(Boolean);

export const createBlog = async ({ data }: { data: CreateBlogFormTypes }) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in to create a blog" };
  }

  try {
    const blog = await createBlogRecord({
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image || null,
      categoryId: Number(data.categoryId),
      tags: toTagsArray(data.tags),
      authorId: Number(session.user.id),
    });
    revalidateTag("BLOGS");
    return { success: true, message: "Blog created successfully", data: blog };
  } catch (error) {
    console.error("createBlog failed:", error);
    return { success: false, message: "Failed to create blog" };
  }
};

export const updateBlog = async ({
  data,
  id,
}: {
  data: CreateBlogFormTypes;
  id: number;
}) => {
  try {
    const blog = await updateBlogRecord(id, {
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image || null,
      categoryId: Number(data.categoryId),
      tags: toTagsArray(data.tags),
    });
    revalidateTag("BLOGS");
    return { success: true, message: "Blog updated successfully", data: blog };
  } catch (error) {
    console.error("updateBlog failed:", error);
    return { success: false, message: "Failed to update blog" };
  }
};

export const deleteBlog = async (id: number) => {
  try {
    await deleteBlogRecord(id);
    revalidateTag("BLOGS");
    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    console.error("deleteBlog failed:", error);
    return { success: false, message: "Failed to delete blog" };
  }
};
