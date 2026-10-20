import type { Metadata } from "next";
import { site } from "./site";

/**
 * Per-page metadata with a canonical URL and matching Open Graph / Twitter
 * fields (AGENTS.md › SEO checklist). The root layout's title template adds
 * the site name, so pass the page's own title only.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: title ? `${title} · ${site.name}` : site.title,
      description,
      siteName: site.name,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} · ${site.name}` : site.title,
      description,
      creator: site.twitter,
    },
  };
}
