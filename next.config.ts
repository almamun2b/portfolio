import type { NextConfig } from "next";

const root = import.meta.dirname;

// Static security headers (ARCHITECTURE.md §11). Every page is static, so the
// CSP is a static policy ('unsafe-inline' for Next's inline bootstrap
// scripts) rather than a per-request nonce. It ships report-only until a
// production check shows no violations; then rename the key to enforce it.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "object-src 'none'",
  // Add "upgrade-insecure-requests" when enforcing: report-only ignores it.
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

// URLs of the previous portfolio (still indexed and linked from old CVs) →
// their pages here, plus slugs renamed before launch. Specific rules come
// before the `/project/:slug` catch-all.
const legacyRedirects = [
  ["/about-me", "/about"],
  ["/contact-me", "/contact"],
  ["/project", "/projects"],
  [
    "/project/full-stack-starter-templates",
    "/projects/nextjs-starter-template",
  ],
  [
    "/project/ai-website-marketing-generator",
    "/projects/ai-go-to-market-platform",
  ],
  [
    "/project/now-health-international-health-insurance",
    "/projects/now-health",
  ],
  ["/project/:slug", "/projects/:slug"],
  ["/projects/fullstack-starter-kit", "/projects/nextjs-starter-template"],
  ["/projects/lead-enrichment-pipeline", "/projects/linkedin-lead-generation"],
  ["/projects/contact-discovery-cli", "/projects/website-email-scraper"],
  ["/mamun.pdf", "/resume.pdf"],
  ["/terms-conditions", "/terms-and-conditions"],
  // iOS asks for this path when a page doesn't name its touch icon.
  ["/apple-touch-icon.png", "/apple-icon.png"],
] as const;

const hsts = {
  key: "Strict-Transport-Security",
  value: "max-age=63072000; includeSubDomains; preload",
};

// Dev needs eval for React Refresh, so the CSP and HSTS are production-only.
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: root,
  turbopack: { root },
  poweredByHeader: false,
  typedRoutes: true,
  images: { formats: ["image/avif", "image/webp"] },
  headers() {
    return [
      {
        source: "/:path*",
        headers: isDev
          ? securityHeaders
          : [
              ...securityHeaders,
              hsts,
              { key: "Content-Security-Policy-Report-Only", value: csp },
            ],
      },
    ];
  },
  redirects() {
    return [
      ...legacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      // The old blog isn't ported yet; temporary so a future post can take the
      // URL back.
      { source: "/blog/:path*", destination: "/", permanent: false },
      { source: "/blog", destination: "/", permanent: false },
    ];
  },
  allowedDevOrigins: [
    new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
      .hostname,
  ],
};

export default nextConfig;
