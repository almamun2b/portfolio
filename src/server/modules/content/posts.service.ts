import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import type { PostDTO } from "@/lib/dto";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { postSelect, toPostDTO } from "../posts/posts.model";

// Blog posts live in Postgres (admin: /admin/blogs). Only PUBLISHED posts are
// read here, through cached, tagged getters, so /blog prerenders and an admin
// save refreshes it. The body is sanitized HTML (see core/rich-text.ts).

export type PostSummary = Omit<PostDTO, "body">;

function toSummary(post: PostDTO): PostSummary {
  const { body: _body, ...summary } = post;
  return summary;
}

/** Newest first. Summaries only: bodies can be large. */
export async function getPosts(
  filter: { category?: string; limit?: number } = {},
): Promise<PostSummary[]> {
  "use cache";
  cacheTag(CACHE_TAGS.POSTS, CACHE_TAGS.CATEGORIES);
  cacheLife("days");
  const rows = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      ...(filter.category
        ? { categories: { some: { slug: filter.category } } }
        : {}),
    },
    select: postSelect,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: filter.limit,
  });
  return rows.map((row) => toSummary(toPostDTO(row)));
}

export async function getPostBySlug(slug: string): Promise<PostDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.POSTS, CACHE_TAGS.CATEGORIES);
  cacheLife("days");
  const row = await db.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: postSelect,
  });
  return row ? toPostDTO(row) : null;
}

export async function getPostSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CACHE_TAGS.POSTS);
  cacheLife("days");
  const rows = await db.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    orderBy: [{ publishedAt: "desc" }],
  });
  return rows.map((r) => r.slug);
}

/** Categories with at least one published post. */
export async function getPostCategories(): Promise<
  { slug: string; name: string; postCount: number }[]
> {
  "use cache";
  cacheTag(CACHE_TAGS.POSTS, CACHE_TAGS.CATEGORIES);
  cacheLife("days");
  const rows = await db.category.findMany({
    where: { posts: { some: { status: "PUBLISHED" } } },
    select: {
      slug: true,
      name: true,
      _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    postCount: r._count.posts,
  }));
}
