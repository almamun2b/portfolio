import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

export const accountTags = {
  changePassword: (_input: unknown, result: { userId: string }) => [
    CACHE_TAGS.user(result.userId),
    CACHE_TAGS.sessions(result.userId),
    CACHE_TAGS.AUDIT,
  ],
} satisfies MutationTags;
