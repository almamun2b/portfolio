import type { ReactNode } from "react";

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
        background:
          "radial-gradient(circle at 15% 0%, rgba(16,185,129,0.32), transparent 55%), radial-gradient(circle at 90% 100%, rgba(34,211,238,0.22), transparent 55%), #05090b",
        color: "#ecfdf5",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg,#047857,#0e7490)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          M
        </div>
        <div style={{ fontSize: 26, color: "rgba(236,253,245,0.7)" }}>
          {eyebrow}
        </div>
      </div>
      {children}
    </div>
  );
}
