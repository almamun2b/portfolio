import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import type { Project } from "@/lib/schemas/content";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import {
  parseLinks,
  parseShots,
  projectSelect,
} from "../projects/projects.model";
import { contentContextSchema, toCoverArt } from "./content.model";

// Projects live in Postgres (admin: /admin/projects). Every getter reads the
// one cached list of PUBLISHED projects, so pages prerender with the content
// in the HTML, and an admin save expires the `projects` tag to refresh them.
// Drafts never leave this file.

/** Ordered as /projects shows them. Plain data, so it caches and serializes. */
async function listPublished(): Promise<Project[]> {
  "use cache";
  cacheTag(CACHE_TAGS.PROJECTS, CACHE_TAGS.CATEGORIES);
  cacheLife("days");
  const rows = await db.project.findMany({
    where: { status: "PUBLISHED" },
    select: projectSelect,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((row) => {
    const { context, contribution } = contentContextSchema.parse(row);
    return {
      slug: row.slug,
      title: row.title,
      tagline: row.tagline,
      summary: row.summary,
      context,
      contribution,
      role: row.role,
      year: row.year,
      categories: row.categories.map((c) => c.slug),
      featured: row.featured,
      stack: row.stack as Project["stack"],
      problem: row.problem,
      approach: row.approach,
      outcomes: row.outcomes,
      myPart: row.myPart.length > 0 ? row.myPart : undefined,
      links: parseLinks(row.links),
      coverArt: toCoverArt(row.coverArt),
      media: { shots: parseShots(row.media) },
    };
  });
}

export interface ProjectFilter {
  featured?: boolean;
  category?: string;
}

export async function getProjects(
  filter: ProjectFilter = {},
): Promise<Project[]> {
  const all = await listPublished();
  return all.filter(
    (p) =>
      (filter.featured === undefined || p.featured === filter.featured) &&
      (filter.category === undefined || p.categories.includes(filter.category)),
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await listPublished();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const all = await listPublished();
  return all.map((p) => p.slug);
}

export async function getAdjacentProjects(
  slug: string,
): Promise<{ previous: Project | null; next: Project | null }> {
  const all = await listPublished();
  const index = all.findIndex((p) => p.slug === slug);
  const at = (i: number) => all[(i + all.length) % all.length] ?? null;
  return index === -1
    ? { previous: null, next: null }
    : { previous: at(index - 1), next: at(index + 1) };
}

export async function getProjectCounts(): Promise<{
  total: number;
  live: number;
  byCategory: Record<string, number>;
}> {
  const all = await listPublished();
  const byCategory: Record<string, number> = {};
  for (const p of all) {
    for (const c of p.categories) byCategory[c] = (byCategory[c] ?? 0) + 1;
  }
  return {
    total: all.length,
    live: all.filter((p) => p.links.live).length,
    byCategory,
  };
}
