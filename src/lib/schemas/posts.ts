import { z } from "zod";
import { idSchema, listBase, sortByParam, sortOrder } from "./common";
import {
  csvField,
  imageUrlSchema,
  optionalText,
  publishStatus,
  slugSchema,
} from "./form-helpers";

export const POST_SORT_KEYS = [
  "title",
  "status",
  "publishedAt",
  "updatedAt",
  "createdAt",
] as const;

export const postListParamsSchema = z.object({
  ...listBase,
  status: publishStatus.optional().catch(undefined),
  sortBy: sortByParam(POST_SORT_KEYS, "updatedAt"),
  sortOrder,
});
export type PostListParams = z.output<typeof postListParamsSchema>;

/** `<input type="datetime-local">` value or ISO string -> Date. */
const dateField = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.coerce.date().optional(),
);

export const postBodySchema = z.object({
  title: z.string().trim().min(3, "Enter a title.").max(140),
  slug: slugSchema,
  excerpt: z.string().trim().min(10, "Write a short summary.").max(320),
  body: z.string().min(1, "Write the post.").max(200_000),
  coverUrl: optionalText(imageUrlSchema),
  coverAlt: optionalText(z.string().trim().max(200)),
  status: publishStatus.default("DRAFT"),
  publishedAt: dateField,
  seoTitle: optionalText(z.string().trim().max(70)),
  seoDescription: optionalText(z.string().trim().max(170)),
  categoryIds: csvField(idSchema).default([]),
});
export type PostInput = z.input<typeof postBodySchema>;

export const createPostSchema = postBodySchema;
export const updatePostSchema = postBodySchema.extend({ id: idSchema });
export type UpdatePostInput = z.input<typeof updatePostSchema>;
export const postIdSchema = z.object({ id: idSchema });
