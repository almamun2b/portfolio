import type { MetadataRoute } from "next";
import { absoluteUrl, projectHref } from "@/lib/site";
import { getSiteLastModified } from "@/server/modules/content/clock.service";
import { getPostSlugs } from "@/server/modules/content/posts.service";
import { getProjectSlugs } from "@/server/modules/content/projects.service";

// Pages count as changed when the sitemap was last rendered (daily). The legal pages carry their own "last updated" date.
const LEGAL_UPDATED = new Date("2026-10-21");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, postSlugs] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
  ]);
  const built = await getSiteLastModified();
  const pages = [
    { path: "/", priority: 1, lastModified: built },
    { path: "/projects", priority: 0.9, lastModified: built },
    ...(postSlugs.length > 0
      ? [{ path: "/blog", priority: 0.7, lastModified: built }]
      : []),
    { path: "/about", priority: 0.8, lastModified: built },
    { path: "/contact", priority: 0.7, lastModified: built },
    { path: "/privacy-policy", priority: 0.3, lastModified: LEGAL_UPDATED },
    {
      path: "/terms-and-conditions",
      priority: 0.3,
      lastModified: LEGAL_UPDATED,
    },
  ];
  return [
    ...pages.map(({ path, priority, lastModified }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...slugs.map((slug) => ({
      url: absoluteUrl(projectHref(slug)),
      lastModified: built,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...postSlugs.map((slug) => ({
      url: absoluteUrl(`/blog/${slug}`),
      lastModified: built,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
