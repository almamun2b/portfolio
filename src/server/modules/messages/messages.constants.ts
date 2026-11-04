import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

export const MESSAGE_SEARCHABLE_FIELDS = [
  "name",
  "email",
  "subject",
  "body",
] as const;

interface WithId {
  id: string;
}

const changed = ({ id }: WithId) => [
  CACHE_TAGS.MESSAGES,
  CACHE_TAGS.message(id),
  CACHE_TAGS.DASHBOARD,
  CACHE_TAGS.AUDIT,
];

export const messageTags = {
  /** A visitor submission: no audit row (no admin acted), but counts change. */
  submit: () => [CACHE_TAGS.MESSAGES, CACHE_TAGS.DASHBOARD],
  setStatus: changed,
  remove: changed,
} satisfies MutationTags;
