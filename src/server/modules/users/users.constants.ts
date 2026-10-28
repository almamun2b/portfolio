import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

export const USER_SEARCHABLE_FIELDS = ["name", "email"] as const;

interface WithId {
  id: string;
}

const accountChanged = ({ id }: WithId) => [
  CACHE_TAGS.USERS,
  CACHE_TAGS.user(id),
  CACHE_TAGS.sessions(id),
  CACHE_TAGS.DASHBOARD,
  CACHE_TAGS.AUDIT,
];

/**
 * What each user mutation expires. The Server Action (updateTag) and the
 * Route Handler (revalidateTag) for the same mutation both read this map.
 */
export const userTags = {
  create: () => [CACHE_TAGS.USERS, CACHE_TAGS.DASHBOARD, CACHE_TAGS.AUDIT],
  update: ({ id }: WithId) => [
    CACHE_TAGS.USERS,
    CACHE_TAGS.user(id),
    CACHE_TAGS.AUDIT,
  ],
  setStatus: accountChanged,
  remove: accountChanged,
  setPassword: accountChanged,
} satisfies MutationTags;
