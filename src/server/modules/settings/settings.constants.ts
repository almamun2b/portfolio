import { CACHE_TAGS, type MutationTags } from "@/server/core/cache";

// Profile and social links appear on every public page (header, footer, hero,
// JSON-LD, OG image), so a settings save expires the public `settings` tag.
const changed = () => [CACHE_TAGS.SETTINGS, CACHE_TAGS.AUDIT];

export const settingsTags = {
  updateProfile: changed,
  updateSocials: changed,
} satisfies MutationTags;
