import { readFile } from "node:fs/promises";
import { cacheLife } from "next/cache";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brand, rgba } from "@/lib/brand-colors";
import { OG_SIZE, OgFrame } from "@/lib/og";
import { getTech } from "@/lib/tech";
import { getProfile } from "@/server/modules/content/profile.service";

export const alt = "Md Abdul Mamun, Full-Stack Software Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

// File reads count as request-time work under Cache Components; the portrait
// never changes between deploys, so cache it for good.
async function readPortrait() {
  "use cache";
  cacheLife("max");
  const portrait = await readFile(
    path.join(process.cwd(), "src/assets/portrait-square.jpg"),
  );
  return `data:image/jpeg;base64,${portrait.toString("base64")}`;
}

export default async function OpengraphImage() {
  const profile = await getProfile();
  const src = await readPortrait();

  return new ImageResponse(
    <OgFrame eyebrow="portfolio · full-stack engineer">
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Md Abdul Mamun
          </div>
          <div style={{ fontSize: 36, color: brand.accentText }}>
            Full-Stack Software Engineer
          </div>
          <div
            style={{
              fontSize: 26,
              color: rgba(brand.textRgb, 0.72),
              maxWidth: 680,
            }}
          >
            {profile.primaryStack.map((id) => getTech(id).label).join(" · ")}
          </div>
        </div>
        <img
          src={src}
          alt=""
          width={260}
          height={260}
          style={{
            borderRadius: 999,
            border: `6px solid ${brand.primary}`,
            objectFit: "cover",
          }}
        />
      </div>
    </OgFrame>,
    size,
  );
}
