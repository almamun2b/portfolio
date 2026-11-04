import type { CategoryDTO, Paginated } from "@/lib/dto";
import type {
  CategoryInput,
  CategoryListParams,
  UpdateCategoryInput,
} from "@/lib/schemas/categories";
import { categoryBodySchema } from "@/lib/schemas/categories";
import { writeAudit } from "@/server/core/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import { assertAdmin, requireAdmin } from "@/server/modules/auth/auth.guard";
import { cacheLife, cacheTag } from "next/cache";
import { QueryBuilder } from "query-builder-prisma";
import "server-only";
import { CATEGORY_SEARCHABLE_FIELDS } from "./categories.constants";
import {
  categorySelect,
  isUniqueViolation,
  toCategoryDTO,
  type CategoryRow,
} from "./categories.model";

const slugTaken = () =>
  AppError.conflict("That slug is already in use.", {
    slug: ["That slug is already in use."],
  });
const gone = () => AppError.notFound("That category no longer exists.");

// ---- reads -----------------------------------------------------------------

export async function listCategories(
  params: CategoryListParams,
): Promise<Paginated<CategoryDTO>> {
  await requireAdmin();
  return listCategoriesCached(params);
}

async function listCategoriesCached(
  params: CategoryListParams,
): Promise<Paginated<CategoryDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.CATEGORIES);
  cacheLife("admin");
  const { data, meta } = await new QueryBuilder(db.category)
    .search({
      searchText: params.searchTerm,
      fields: [...CATEGORY_SEARCHABLE_FIELDS],
    })
    .orderBy([{ [params.sortBy]: params.sortOrder }, { id: "asc" }])
    .paginate({ page: params.page, limit: params.limit })
    .select(categorySelect)
    .executeWithMeta();
  return { data: data.map((row) => toCategoryDTO(row as CategoryRow)), meta };
}

/** Every category, ordered, for pickers in the project and post forms. */
export async function listAllCategories(): Promise<CategoryDTO[]> {
  await requireAdmin();
  return listAllCategoriesCached();
}

async function listAllCategoriesCached(): Promise<CategoryDTO[]> {
  "use cache";
  cacheTag(CACHE_TAGS.CATEGORIES);
  cacheLife("admin");
  const rows = await db.category.findMany({
    select: categorySelect,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(toCategoryDTO);
}

export async function getCategoryById(id: string): Promise<CategoryDTO | null> {
  await requireAdmin();
  return getCategoryByIdCached(id);
}

async function getCategoryByIdCached(id: string): Promise<CategoryDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.CATEGORIES, CACHE_TAGS.category(id));
  cacheLife("admin");
  const row = await db.category.findUnique({
    where: { id },
    select: categorySelect,
  });
  return row ? toCategoryDTO(row) : null;
}

// ---- writes ----------------------------------------------------------------

export async function createCategory(
  input: CategoryInput,
): Promise<CategoryDTO> {
  const actor = await assertAdmin();
  const data = categoryBodySchema.parse(input);
  try {
    const row = await db.$transaction(async (tx) => {
      const created = await tx.category.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description ?? null,
          sortOrder: data.sortOrder,
        },
        select: categorySelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "category.create",
          targetType: "category",
          targetId: created.id,
          metadata: { slug: data.slug },
        },
        tx,
      );
      return created;
    });
    return toCategoryDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw slugTaken();
    throw error;
  }
}

export async function updateCategory(
  input: UpdateCategoryInput,
): Promise<CategoryDTO> {
  const actor = await assertAdmin();
  const { id, ...rest } = input;
  const data = categoryBodySchema.parse(rest);
  const before = await db.category.findUnique({
    where: { id },
    select: { slug: true, name: true },
  });
  if (!before) throw gone();
  try {
    const row = await db.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description ?? null,
          sortOrder: data.sortOrder,
        },
        select: categorySelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "category.update",
          targetType: "category",
          targetId: id,
          metadata: { from: before, to: { slug: data.slug, name: data.name } },
        },
        tx,
      );
      return updated;
    });
    return toCategoryDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw slugTaken();
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const actor = await assertAdmin();
  const target = await db.category.findUnique({
    where: { id },
    select: { slug: true, _count: { select: { projects: true } } },
  });
  if (!target) throw gone();
  if (target._count.projects > 0) {
    throw AppError.conflict(
      `${String(target._count.projects)} project(s) use this category. Move them to another category first.`,
    );
  }
  await db.$transaction(async (tx) => {
    await writeAudit(
      {
        actorId: actor.id,
        action: "category.delete",
        targetType: "category",
        targetId: id,
        metadata: { slug: target.slug },
      },
      tx,
    );
    await tx.category.delete({ where: { id } });
  });
}
