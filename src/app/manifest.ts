import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand-colors";
import { site, siteDescription } from "@/lib/site";
import { getCareerStats } from "@/server/dal/profile";

export const revalidate = 86400;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { years } = await getCareerStats();
  return {
    name: site.title,
    short_name: "Mamun",
    description: siteDescription(years),
    start_url: "/",
    display: "standalone",
    background_color: brand.themeColor,
    theme_color: brand.themeColor,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
