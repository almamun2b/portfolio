import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { ProjectAdminDTO, ProjectShotDTO } from "@/lib/dto";
import { categoryRefSelect } from "../categories/categories.model";

export const projectSelect = {
  id: true,
  slug: true,
  title: true,
  tagline: true,
  summary: true,
  context: true,
  contribution: true,
  role: true,
  year: true,
  featured: true,
  status: true,
  sortOrder: true,
  stack: true,
  problem: true,
  approach: true,
  outcomes: true,
  myPart: true,
  links: true,
  coverArt: true,
  media: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  categories: {
    select: categoryRefSelect,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  },
} satisfies Prisma.ProjectSelect;

export type ProjectRow = Prisma.ProjectGetPayload<{
  select: typeof projectSelect;
}>;

const LINK_KEYS = ["live", "source", "api", "apiSource"] as const;

/** `links` is a JSON column; keep only known keys with string values. */
export function parseLinks(value: unknown): ProjectAdminDTO["links"] {
  const out: ProjectAdminDTO["links"] = {};
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of LINK_KEYS) {
      const v = (value as Record<string, unknown>)[key];
      if (typeof v === "string" && v) out[key] = v;
    }
  }
  return out;
}

/** `media` is a JSON column: drop anything that isn't a well-formed shot. */
export function parseShots(value: unknown): ProjectShotDTO[] {
  if (!Array.isArray(value)) return [];
  const shots: ProjectShotDTO[] = [];
  for (const item of value as unknown[]) {
    if (!item || typeof item !== "object") continue;
    const s = item as Record<string, unknown>;
    if (
      typeof s.src === "string" &&
      typeof s.alt === "string" &&
      typeof s.width === "number" &&
      typeof s.height === "number" &&
      (s.device === "desktop" || s.device === "mobile" || s.device === "detail")
    ) {
      shots.push({
        src: s.src,
        alt: s.alt,
        width: s.width,
        height: s.height,
        device: s.device,
      });
    }
  }
  return shots;
}

export function toProjectAdminDTO(row: ProjectRow): ProjectAdminDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    summary: row.summary,
    context: row.context,
    contribution: row.contribution,
    role: row.role,
    year: row.year,
    featured: row.featured,
    status: row.status,
    sortOrder: row.sortOrder,
    stack: row.stack,
    problem: row.problem,
    approach: row.approach,
    outcomes: row.outcomes,
    myPart: row.myPart,
    links: parseLinks(row.links),
    coverArt: row.coverArt,
    media: parseShots(row.media),
    categories: row.categories,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
