import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import type { PublicCategory } from "@/lib/schemas/content";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";

/**
 * Categories that have at least one published project, in the order the
 * owner set. They drive the /projects filter, the landing tabs, the footer
 * links, and the labels on case studies.
 */
export async function getProjectCategories(): Promise<PublicCategory[]> {
  "use cache";
  cacheTag(CACHE_TAGS.CATEGORIES, CACHE_TAGS.PROJECTS);
  cacheLife("days");
  const rows = await db.category.findMany({
    where: { projects: { some: { status: "PUBLISHED" } } },
    select: {
      slug: true,
      name: true,
      description: true,
      _count: { select: { projects: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description,
    projectCount: row._count.projects,
  }));
}
