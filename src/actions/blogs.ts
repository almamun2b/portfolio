"use server";

import { CreateBlogFormTypes } from "@/components/modules/Blogs/CreateBlogForm";
import { getUserSession } from "@/helpers/getUserSession";
import { revalidateTag } from "next/cache";

export const createBlog = async ({ data }: { data: CreateBlogFormTypes }) => {
  const session = await getUserSession();
  const tagsArray = data.tags
    .toString()
    .split(",")
    .map((tag: string) => tag.trim());

  const modifiedBlogInfo = {
    ...data,
    tags: tagsArray,
    categoryId: Number(data.categoryId),
    authorId: session?.user?.id,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifiedBlogInfo),
  });

  const result = await res.json();
  if (result.success) {
    revalidateTag("BLOGS");
  }
  return result;
};

export const updateBlog = async ({
  data,
  id,
}: {
  data: CreateBlogFormTypes;
  id: number;
}) => {
  const session = await getUserSession();
  const tagsArray = data.tags
    .toString()
    .split(",")
    .map((tag: string) => tag.trim());

  const modifiedBlogInfo = {
    ...data,
    tags: tagsArray,
    categoryId: Number(data.categoryId),
    authorId: session?.user?.id,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifiedBlogInfo),
  });

  const result = await res.json();
  if (result.success) {
    revalidateTag("BLOGS");
  }
  return result;
};

export const deleteBlog = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  if (result.success) {
    revalidateTag("BLOGS");
  }
  return result;
};
