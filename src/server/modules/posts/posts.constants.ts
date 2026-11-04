import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

export const POST_SEARCHABLE_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "bodyText",
] as const;

interface WithId {
  id: string;
}

// A post change refreshes the admin list, the post's own entry, and the public
// blog (list + detail + sitemap all read the `posts` tag).
const changed = ({ id }: WithId) => [
  CACHE_TAGS.POSTS,
  CACHE_TAGS.post(id),
  CACHE_TAGS.CATEGORIES,
  CACHE_TAGS.DASHBOARD,
  CACHE_TAGS.AUDIT,
];

export const postTags = {
  create: () => [
    CACHE_TAGS.POSTS,
    CACHE_TAGS.CATEGORIES,
    CACHE_TAGS.DASHBOARD,
    CACHE_TAGS.AUDIT,
  ],
  update: changed,
  remove: changed,
} satisfies MutationTags;
