import portrait from "@/assets/portrait-square.jpg";
import type { Experience, Profile, Project, Social } from "./schemas/content";
import { absoluteUrl, projectHref, site } from "./site";
import { getTech } from "./tech";

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
    image: absoluteUrl(portrait.src),
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
      ...profile.stack.map((id) => getTech(id).label),
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

/** For / and /about: Google's profile-page rich result, about the Person. */
export function profilePageJsonLd(path: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(path),
    mainEntity: { "@id": absoluteUrl("/#person") },
  };
}

export function projectJsonLd(project: Project): JsonLd {
  const shot = project.media.shots[0];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(projectHref(project.slug)),
    dateCreated: project.year,
    creator: { "@id": absoluteUrl("/#person") },
    keywords: project.stack.join(", "),
    ...(shot ? { image: absoluteUrl(shot.src) } : {}),
    ...(project.links.live ? { sameAs: project.links.live } : {}),
  };
}
