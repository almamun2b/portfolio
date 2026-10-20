import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: "Mamun",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#05090b",
    theme_color: "#05090b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
