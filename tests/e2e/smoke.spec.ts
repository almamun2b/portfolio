import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/projects/travel-buddy",
  "/projects/express-prisma-starter",
];

for (const route of ROUTES) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = axe.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("unknown pages 404 without a canonical", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

const REDIRECTS: [string, string][] = [
  ["/about-me", "/about"],
  ["/contact-me", "/contact"],
  ["/project", "/projects"],
  ["/project/travel-buddy", "/projects/travel-buddy"],
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
  ["/projects/fullstack-starter-kit", "/projects/nextjs-starter-template"],
  ["/projects/lead-enrichment-pipeline", "/projects/linkedin-lead-generation"],
  ["/projects/contact-discovery-cli", "/projects/website-email-scraper"],
  ["/mamun.pdf", "/resume.pdf"],
  ["/terms-conditions", "/terms-and-conditions"],
];

test("old URLs redirect permanently", async ({ request }) => {
  for (const [from, to] of REDIRECTS) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
});

test("icons and manifest are served", async ({ request }) => {
  for (const path of [
    "/favicon.ico",
    "/apple-icon.png",
    "/manifest.webmanifest",
    "/tech-sprite.svg",
    "/icons/icon-512.png",
  ])
    expect((await request.get(path)).status(), path).toBe(200);
});
