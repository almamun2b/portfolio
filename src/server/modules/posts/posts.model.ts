import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { PostDTO } from "@/lib/dto";
import { readingMinutes } from "@/server/core/rich-text";
import { categoryRefSelect } from "../categories/categories.model";

export const postSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  body: true,
  bodyText: true,
  coverUrl: true,
  coverAlt: true,
  status: true,
  publishedAt: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
  categories: {
    select: categoryRefSelect,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  },
} satisfies Prisma.PostSelect;

export type PostRow = Prisma.PostGetPayload<{ select: typeof postSelect }>;

export function toPostDTO(row: PostRow): PostDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    readingMinutes: readingMinutes(row.bodyText),
    coverUrl: row.coverUrl,
    coverAlt: row.coverAlt,
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    categories: row.categories,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
