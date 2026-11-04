import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { CategoryDTO, CategoryRefDTO } from "@/lib/dto";

export const categoryRefSelect = {
  id: true,
  slug: true,
  name: true,
} satisfies Prisma.CategorySelect;

export const categorySelect = {
  ...categoryRefSelect,
  description: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { projects: true, posts: true } },
} satisfies Prisma.CategorySelect;

export type CategoryRow = Prisma.CategoryGetPayload<{
  select: typeof categorySelect;
}>;

export function toCategoryDTO(row: CategoryRow): CategoryDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    sortOrder: row.sortOrder,
    projectCount: row._count.projects,
    postCount: row._count.posts,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toCategoryRef(row: CategoryRefDTO): CategoryRefDTO {
  return { id: row.id, slug: row.slug, name: row.name };
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
