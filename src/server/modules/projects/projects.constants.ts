import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

export const PROJECT_SEARCHABLE_FIELDS = [
  "title",
  "slug",
  "tagline",
  "summary",
] as const;

interface WithId {
  id: string;
}

// The public landing page, /projects, case studies, the sitemap, and OG
// images all read the `projects` tag, so one admin save refreshes them.
const changed = ({ id }: WithId) => [
  CACHE_TAGS.PROJECTS,
  CACHE_TAGS.project(id),
  CACHE_TAGS.CATEGORIES,
  CACHE_TAGS.DASHBOARD,
  CACHE_TAGS.AUDIT,
];

export const projectTags = {
  create: () => [
    CACHE_TAGS.PROJECTS,
    CACHE_TAGS.CATEGORIES,
    CACHE_TAGS.DASHBOARD,
    CACHE_TAGS.AUDIT,
  ],
  update: changed,
  remove: changed,
} satisfies MutationTags;
