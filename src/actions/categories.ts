"use server";

import { CreateCategoryFormTypes } from "@/components/modules/Blogs/CreateCategoryForm";
import {
  createCategoryRecord,
  deleteCategoryRecord,
  updateCategoryRecord,
} from "@/lib/queries";
import { revalidateTag } from "next/cache";

export const createCategory = async ({
  data,
}: {
  data: CreateCategoryFormTypes;
}) => {
  try {
    const category = await createCategoryRecord({ name: data.name });
    revalidateTag("CATEGORIES");
    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    console.error("createCategory failed:", error);
    return { success: false, message: "Failed to create category" };
  }
};

export const updateCategory = async ({
  data,
  id,
}: {
  data: CreateCategoryFormTypes;
  id: number;
}) => {
  try {
    const category = await updateCategoryRecord(id, { name: data.name });
    revalidateTag("CATEGORIES");
    return {
      success: true,
      message: "Category updated successfully",
      data: category,
    };
  } catch (error) {
    console.error("updateCategory failed:", error);
    return { success: false, message: "Failed to update category" };
  }
};

export const deleteCategory = async (id: number) => {
  try {
    await deleteCategoryRecord(id);
    revalidateTag("CATEGORIES");
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("deleteCategory failed:", error);
    return { success: false, message: "Failed to delete category" };
  }
};
