import type { Route } from "next";
import { env } from "@/env";

// Site-wide constants that aren't content (content lives in src/content and
// is read through the DAL).
export const site = {
  name: "Md Abdul Mamun",
  title: "Md Abdul Mamun · Full-Stack Software Engineer",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
  twitter: "@almamun2b",
  googleSiteVerification: "FrEB4FD5CYUogdl7GrnSGBmkcKr7RVWz2hUtWjTFojU",
} as const;

/**
 * The site-wide description. `years` comes from getCareerStats() so the
 * number is derived from the content, never typed in.
 */
export const siteDescription = (years: number) =>
  `Full-stack software engineer with ${String(years)}+ years building production web apps with React, Next.js, Vue/Nuxt, Node.js, Express, PostgreSQL, and Shopify. Currently at Xubitar.`;

export const absoluteUrl = (path = "/") =>
  new URL(path, `${site.url}/`).toString();

/** Typed href for a case study (dynamic routes can't be inferred from a string). */
export const projectHref = (slug: string) => `/projects/${slug}` as Route;
