"use server";

import { CreateBlogFormTypes } from "@/components/modules/Blogs/CreateBlogForm";
import { revalidateTag } from "next/cache";

// export interface CreateBlogForm {
//   title: string;
//   description: string;
//   content: string;
//   image: string;
//   categoryId: string;
//   tags: string;
//   isFeatured: boolean;
// }

export const createBlog = async ({ data }: { data: CreateBlogFormTypes }) => {
  const tagsArray = data.tags
    .toString()
    .split(",")
    .map((tag: string) => tag.trim());

  const modifiedBlogInfo = {
    ...data,
    tags: tagsArray,
    categoryId: Number(data.categoryId),
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
  const tagsArray = data.tags
    .toString()
    .split(",")
    .map((tag: string) => tag.trim());

  const modifiedBlogInfo = {
    ...data,
    tags: tagsArray,
    categoryId: Number(data.categoryId),
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
