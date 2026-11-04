import type { Paginated, PostDTO } from "@/lib/dto";
import {
  postBodySchema,
  type PostInput,
  type PostListParams,
  type UpdatePostInput,
} from "@/lib/schemas/posts";
import { writeAudit } from "@/server/core/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import { htmlToText, sanitizePostHtml } from "@/server/core/rich-text";
import { assertAdmin, requireAdmin } from "@/server/modules/auth/auth.guard";
import { cacheLife, cacheTag } from "next/cache";
import { QueryBuilder } from "query-builder-prisma";
import "server-only";
import { isUniqueViolation } from "../categories/categories.model";
import { POST_SEARCHABLE_FIELDS } from "./posts.constants";
import { postSelect, toPostDTO, type PostRow } from "./posts.model";

const slugTaken = () =>
  AppError.conflict("That slug is already in use.", {
    slug: ["That slug is already in use."],
  });
const gone = () => AppError.notFound("That post no longer exists.");

// ---- reads -----------------------------------------------------------------

export async function listPosts(
  params: PostListParams,
): Promise<Paginated<PostDTO>> {
  await requireAdmin();
  return listPostsCached(params);
}

async function listPostsCached(
  params: PostListParams,
): Promise<Paginated<PostDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.POSTS);
  cacheLife("admin");
  const { data, meta } = await new QueryBuilder(db.post)
    .search({
      searchText: params.searchTerm,
      fields: [...POST_SEARCHABLE_FIELDS],
    })
    .filter({ status: params.status })
    .orderBy([{ [params.sortBy]: params.sortOrder }, { id: "asc" }])
    .paginate({ page: params.page, limit: params.limit })
    .select(postSelect)
    .executeWithMeta();
  return { data: data.map((row) => toPostDTO(row as PostRow)), meta };
}

export async function getPostById(id: string): Promise<PostDTO | null> {
  await requireAdmin();
  return getPostByIdCached(id);
}

async function getPostByIdCached(id: string): Promise<PostDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.POSTS, CACHE_TAGS.post(id));
  cacheLife("admin");
  const row = await db.post.findUnique({ where: { id }, select: postSelect });
  return row ? toPostDTO(row) : null;
}

// ---- writes ----------------------------------------------------------------

/** Publishing stamps `publishedAt` once; going back to draft keeps it. */
function resolvePublishedAt(
  status: "DRAFT" | "PUBLISHED",
  requested: Date | undefined,
  existing: Date | null,
): Date | null {
  if (status === "DRAFT") return requested ?? existing;
  return requested ?? existing ?? new Date();
}

function toData(data: ReturnType<typeof postBodySchema.parse>) {
  if (data.coverUrl && !data.coverAlt) {
    throw AppError.validation("Describe the cover image.", {
      coverAlt: ["Describe the cover image for screen readers."],
    });
  }
  const body = sanitizePostHtml(data.body);
  const bodyText = htmlToText(body);
  if (!bodyText && !body.includes("<img")) {
    throw AppError.validation("Write the post.", {
      body: ["The post is empty."],
    });
  }
  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    body,
    bodyText,
    coverUrl: data.coverUrl ?? null,
    coverAlt: data.coverAlt ?? null,
    status: data.status,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  };
}

async function assertCategories(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const found = await db.category.count({ where: { id: { in: ids } } });
  if (found !== ids.length) {
    throw AppError.validation("Unknown category.", {
      categoryIds: ["One of the selected categories no longer exists."],
    });
  }
}

export async function createPost(input: PostInput): Promise<PostDTO> {
  const actor = await assertAdmin();
  const parsed = postBodySchema.parse(input);
  const data = toData(parsed);
  await assertCategories(parsed.categoryIds);
  try {
    const row = await db.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          ...data,
          publishedAt: resolvePublishedAt(
            data.status,
            parsed.publishedAt,
            null,
          ),
          authorId: actor.id,
          categories: { connect: parsed.categoryIds.map((id) => ({ id })) },
        },
        select: postSelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "post.create",
          targetType: "post",
          targetId: created.id,
          metadata: { slug: data.slug, status: data.status },
        },
        tx,
      );
      return created;
    });
    return toPostDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw slugTaken();
    throw error;
  }
}

export async function updatePost(input: UpdatePostInput): Promise<PostDTO> {
  const actor = await assertAdmin();
  const { id, ...rest } = input;
  const parsed = postBodySchema.parse(rest);
  const data = toData(parsed);
  const before = await db.post.findUnique({
    where: { id },
    select: { slug: true, status: true, publishedAt: true },
  });
  if (!before) throw gone();
  await assertCategories(parsed.categoryIds);
  try {
    const row = await db.$transaction(async (tx) => {
      const updated = await tx.post.update({
        where: { id },
        data: {
          ...data,
          publishedAt: resolvePublishedAt(
            data.status,
            parsed.publishedAt,
            before.publishedAt,
          ),
          categories: { set: parsed.categoryIds.map((cid) => ({ id: cid })) },
        },
        select: postSelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "post.update",
          targetType: "post",
          targetId: id,
          metadata: {
            from: { slug: before.slug, status: before.status },
            to: { slug: data.slug, status: data.status },
          },
        },
        tx,
      );
      return updated;
    });
    return toPostDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw slugTaken();
    throw error;
  }
}

export async function deletePost(id: string): Promise<void> {
  const actor = await assertAdmin();
  const target = await db.post.findUnique({
    where: { id },
    select: { slug: true, title: true },
  });
  if (!target) throw gone();
  await db.$transaction(async (tx) => {
    await writeAudit(
      {
        actorId: actor.id,
        action: "post.delete",
        targetType: "post",
        targetId: id,
        metadata: target,
      },
      tx,
    );
    await tx.post.delete({ where: { id } });
  });
}
