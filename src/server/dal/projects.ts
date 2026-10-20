import "server-only";
import { z } from "zod";
import { capturedMedia } from "@/content/project-media.generated";
import { manualMedia } from "@/content/project-media.manual";
import { projects as rawProjects } from "@/content/projects";
import {
  projectSchema,
  shotSchema,
  type Project,
  type ProjectCategory,
} from "@/lib/schemas/content";

// Static source today: src/content/projects.ts plus the screenshot manifests.
// When projects move to Postgres, only this file changes: keep the exported
// function names and the `Project` DTO shape, and query with explicit
// `select`s instead of parsing the files.

const shotsSchema = z.array(shotSchema);

const all: Project[] = z
  .array(projectSchema)
  .parse(rawProjects)
  .map((record) => ({
    ...record,
    media: {
      // Real screenshots lead; hand-picked detail shots follow.
      shots: shotsSchema.parse([
        ...(capturedMedia[record.slug] ?? []),
        ...(manualMedia[record.slug] ?? []),
      ]),
    },
  }));

const duplicate = all.find(
  (p, i) => all.findIndex((q) => q.slug === p.slug) !== i,
);
if (duplicate) throw new Error(`Duplicate project slug: ${duplicate.slug}`);

export interface ProjectFilter {
  featured?: boolean;
  category?: ProjectCategory;
}

export function getProjects(filter: ProjectFilter = {}): Promise<Project[]> {
  return Promise.resolve(
    all.filter(
      (p) =>
        (filter.featured === undefined || p.featured === filter.featured) &&
        (filter.category === undefined ||
          p.categories.includes(filter.category)),
    ),
  );
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return Promise.resolve(all.find((p) => p.slug === slug) ?? null);
}

export function getProjectSlugs(): Promise<string[]> {
  return Promise.resolve(all.map((p) => p.slug));
}

export function getAdjacentProjects(
  slug: string,
): Promise<{ previous: Project | null; next: Project | null }> {
  const index = all.findIndex((p) => p.slug === slug);
  const at = (i: number) => all[(i + all.length) % all.length] ?? null;
  return Promise.resolve(
    index === -1
      ? { previous: null, next: null }
      : { previous: at(index - 1), next: at(index + 1) },
  );
}

export function getProjectCounts(): Promise<{
  total: number;
  live: number;
  byCategory: Record<ProjectCategory, number>;
}> {
  const byCategory: Record<ProjectCategory, number> = {
    fullstack: 0,
    shopify: 0,
    automation: 0,
    frontend: 0,
  };
  for (const p of all) for (const c of p.categories) byCategory[c] += 1;
  return Promise.resolve({
    total: all.length,
    live: all.filter((p) => p.links.live).length,
    byCategory,
  });
}
