import type { MetadataRoute } from "next";
import { absoluteUrl, projectHref } from "@/lib/site";
import { getProjectSlugs } from "@/server/dal/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();
  const pages = [
    { path: "/", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
  ];
  return [
    ...pages.map(({ path, priority }) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...slugs.map((slug) => ({
      url: absoluteUrl(projectHref(slug)),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
