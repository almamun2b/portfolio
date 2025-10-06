"use server";

import { CreateCategoryFormTypes } from "@/components/modules/Blogs/CreateCategoryForm";
import { revalidateTag } from "next/cache";

export const createCategory = async ({
  data,
}: {
  data: CreateCategoryFormTypes;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (result.success) {
    revalidateTag("CATEGORIES");
  }
  return result;
};

export const updateCategory = async ({
  data,
  id,
}: {
  data: CreateCategoryFormTypes;
  id: number;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/category/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (result.success) {
    revalidateTag("CATEGORIES");
  }
  return result;
};
