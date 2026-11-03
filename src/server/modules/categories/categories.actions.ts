"use server";

import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/schemas/categories";
import { adminAction } from "@/server/core/action";
import { categoryTags } from "./categories.constants";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "./categories.service";

export const createCategoryAction = adminAction(
  "category.create",
  createCategorySchema,
  async (data) => {
    const category = await createCategory(data);
    return { id: category.id };
  },
  { tags: categoryTags.create },
);

export const updateCategoryAction = adminAction(
  "category.update",
  updateCategorySchema,
  async (data) => {
    await updateCategory(data);
  },
  { tags: categoryTags.update },
);

export const deleteCategoryAction = adminAction(
  "category.delete",
  categoryIdSchema,
  async (data) => {
    await deleteCategory(data.id);
  },
  { tags: categoryTags.remove },
);
