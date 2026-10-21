import { getTech } from "@/lib/tech";
import { TECH_IDS } from "@/lib/tech-ids";

// Every technology logo as a <symbol>, served once and cached, so pages
// reference icons with <use href="/tech-sprite.svg#id"> instead of inlining
// the same path data into the HTML and the RSC payload (audit #5).
export const dynamic = "force-static";

export function GET() {
  const symbols = TECH_IDS.map((id) => {
    const { icon } = getTech(id);
    return icon.kind === "glyph"
      ? ""
      : `<symbol id="${id}" viewBox="0 0 24 24"><path d="${icon.path}"/></symbol>`;
  }).join("");
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
  );
}
