import "server-only";

// The seed values for the profile and social links. A fresh database (no
// SiteSetting rows yet) falls back to these so the public site still renders;
// `pnpm db:seed` stores them so /admin/settings edits a real row.
export {
  profile as defaultProfile,
  socials as defaultSocials,
} from "@/content/profile";
