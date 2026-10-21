import type { Metadata } from "next";
import { OG_SIZE } from "./og";
import { site } from "./site";

// Next merges metadata per top-level key, so a page's `openGraph` replaces the
// root layout's and drops the image that src/app/opengraph-image.tsx attached.
// Pages therefore carry the default card explicitly. Routes with their own
// opengraph-image file (case studies) still win: file metadata takes priority.
const defaultImage = {
  url: "/opengraph-image",
  ...OG_SIZE,
  alt: `${site.name}, Full-Stack Software Engineer`,
};

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
      images: [defaultImage],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} · ${site.name}` : site.title,
      description,
      site: site.twitter,
      creator: site.twitter,
      images: [defaultImage],
    },
  };
}
