import type { Experience, Profile, Project, Social } from "./schemas/content";
import { absoluteUrl, projectHref, site } from "./site";

type JsonLd = Record<string, unknown>;

/** Serialize for a <script type="application/ld+json">, escaping `<`. */
export function serializeJsonLd(data: JsonLd | JsonLd[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personJsonLd(
  profile: Profile,
  socials: Social[],
  experience: Experience[],
): JsonLd {
  const current = experience.find((job) => !job.end);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: profile.name,
    alternateName: profile.shortName,
    jobTitle: profile.role,
    description: profile.pitch,
    url: site.url,
    image: absoluteUrl("/opengraph-image"),
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sirajganj",
      addressCountry: "BD",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Begum Rokeya University, Rangpur",
    },
    ...(current
      ? {
          worksFor: {
            "@type": "Organization",
            name: current.company,
            ...(current.companyUrl ? { url: current.companyUrl } : {}),
          },
        }
      : {}),
    knowsAbout: [
      "React",
      "Next.js",
      "Vue.js",
      "Nuxt",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "MongoDB",
      "Shopify app development",
    ],
    sameAs: socials.map((s) => s.href),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    inLanguage: "en",
    author: { "@id": absoluteUrl("/#person") },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectJsonLd(project: Project): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(projectHref(project.slug)),
    dateCreated: project.year,
    creator: { "@id": absoluteUrl("/#person") },
    keywords: project.stack.join(", "),
    ...(project.links.live ? { sameAs: project.links.live } : {}),
  };
}
