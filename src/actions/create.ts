"use server";

import { getUserSession } from "@/helpers/getUserSession";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const createBlog = async (formData: FormData) => {
  const session = await getUserSession();
  const blogInfo = Object.fromEntries(formData.entries());
  const modifiedBlogInfo = {
    ...blogInfo,
    tags: blogInfo.tags
      .toString()
      .split(",")
      .map((tag) => tag.trim()),
    // isFeatured: blogInfo.isFeatured === "true",
    isFeatured: Boolean(blogInfo.isFeatured),
    authorId: session?.user?.id,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifiedBlogInfo),
  });
  const result = await res.json();
  if (result?.id) {
    revalidateTag("BLOGS");
    redirect("/blogs");
  }
  return result;
};
