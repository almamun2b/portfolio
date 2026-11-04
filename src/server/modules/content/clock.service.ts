import "server-only";
import { cacheLife } from "next/cache";

// Reading the clock during a prerender is only allowed inside a cached scope.
// These helpers give the static pages today's date once a day instead of
// freezing it at deploy time.

/** The footer's © year. */
export async function getCopyrightYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** When the site's pages last changed (the sitemap's lastModified). */
export async function getSiteLastModified(): Promise<Date> {
  "use cache";
  cacheLife("days");
  return new Date();
}
