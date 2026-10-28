import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

export const sessionTags = {
  /** Revoking one session only knows its owner once the service has looked it up. */
  revoke: (_input: { sessionId: string }, result: { userId: string }) => [
    CACHE_TAGS.sessions(result.userId),
    CACHE_TAGS.DASHBOARD,
    CACHE_TAGS.AUDIT,
  ],
  revokeAll: ({ id }: { id: string }) => [
    CACHE_TAGS.sessions(id),
    CACHE_TAGS.DASHBOARD,
    CACHE_TAGS.AUDIT,
  ],
} satisfies MutationTags;
