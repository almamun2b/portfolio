import type { ReactNode } from "react";
import { brand, rgba } from "@/lib/brand-colors";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Shared frame for generated Open Graph images (next/og supports a CSS subset). */
export function OgFrame({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `radial-gradient(circle at 15% 0%, ${rgba(brand.primaryRgb, 0.32)}, transparent 55%), radial-gradient(circle at 90% 100%, ${rgba(brand.secondaryRgb, 0.22)}, transparent 55%), ${brand.themeColor}`,
        color: brand.text,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: `linear-gradient(135deg,${brand.buttonFrom},${brand.buttonTo})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          M
        </div>
        <div style={{ fontSize: 26, color: rgba(brand.textRgb, 0.7) }}>
          {eyebrow}
        </div>
      </div>
      {children}
    </div>
  );
}
