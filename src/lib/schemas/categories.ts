import { z } from "zod";
import { idSchema, listBase, sortByParam } from "./common";
import { optionalText, slugSchema, sortOrderField } from "./form-helpers";

export const CATEGORY_SORT_KEYS = [
  "name",
  "slug",
  "sortOrder",
  "createdAt",
] as const;

export const categoryListParamsSchema = z.object({
  ...listBase,
  sortBy: sortByParam(CATEGORY_SORT_KEYS, "sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).catch("asc"),
});
export type CategoryListParams = z.output<typeof categoryListParamsSchema>;

export const categoryBodySchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(60),
  slug: slugSchema,
  description: optionalText(z.string().trim().max(300)),
  sortOrder: sortOrderField.default(0),
});
export type CategoryInput = z.input<typeof categoryBodySchema>;

export const createCategorySchema = categoryBodySchema;
export const updateCategoryBodySchema = categoryBodySchema;
export const updateCategorySchema = categoryBodySchema.extend({ id: idSchema });
export type UpdateCategoryInput = z.input<typeof updateCategorySchema>;
export const categoryIdSchema = z.object({ id: idSchema });
