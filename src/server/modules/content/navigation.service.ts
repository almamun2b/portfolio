import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import { blogNav, mainNav, type NavItem } from "@/content/navigation";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";

/**
 * Header and footer links. "Blog" appears only while at least one post is
 * published, so the site never links to an empty page.
 */
export async function getMainNav(): Promise<readonly NavItem[]> {
  "use cache";
  cacheTag(CACHE_TAGS.POSTS);
  cacheLife("days");
  const hasPosts =
    (await db.post.count({ where: { status: "PUBLISHED" } })) > 0;
  if (!hasPosts) return mainNav;
  // Before "Contact", which stays last.
  const contact = mainNav.at(-1);
  return [...mainNav.slice(0, -1), blogNav, ...(contact ? [contact] : [])];
}
