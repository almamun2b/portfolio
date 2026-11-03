import "server-only";
import sanitizeHtml from "sanitize-html";

// The blog editor (Tiptap) produces HTML. Nothing it sends is trusted: every
// write goes through `sanitizePostHtml`, and pages render only the sanitized
// result. The allow-list matches what the editor toolbar can produce.

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2",
    "h3",
    "h4",
    "p",
    "br",
    "hr",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    code: ["class"],
  },
  allowedClasses: { code: [/^language-[\w-]+$/] },
  allowedSchemes: ["https", "http", "mailto"],
  allowedSchemesByTag: { img: ["https"] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const external = /^https?:/i.test(href);
      return {
        tagName,
        attribs: {
          ...attribs,
          ...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : { rel: "noopener" }),
        },
      };
    },
  },
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS).trim();
}

/** Plain text of sanitized HTML, for search and reading time. */
export function htmlToText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Whole minutes at ~220 words per minute, never below 1. */
export function readingMinutes(text: string): number {
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 220));
}
