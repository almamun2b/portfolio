import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

export const CATEGORY_SEARCHABLE_FIELDS = [
  "name",
  "slug",
  "description",
] as const;

interface WithId {
  id: string;
}

// Categories label projects and posts on the public site, so every change
// also expires those lists.
const publicLists = [CACHE_TAGS.PROJECTS, CACHE_TAGS.POSTS];

export const categoryTags = {
  create: () => [CACHE_TAGS.CATEGORIES, CACHE_TAGS.AUDIT],
  update: ({ id }: WithId) => [
    CACHE_TAGS.CATEGORIES,
    CACHE_TAGS.category(id),
    ...publicLists,
    CACHE_TAGS.AUDIT,
  ],
  remove: ({ id }: WithId) => [
    CACHE_TAGS.CATEGORIES,
    CACHE_TAGS.category(id),
    ...publicLists,
    CACHE_TAGS.AUDIT,
  ],
} satisfies MutationTags;
