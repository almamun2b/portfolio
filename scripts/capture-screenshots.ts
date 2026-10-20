/**
 * Captures screenshots of every project with a live URL and writes
 * src/content/project-media.generated.ts.
 *
 *   pnpm screenshots                 # all projects with a live link
 *   pnpm screenshots travel-buddy    # only the slugs you pass
 *
 * Uses the Chromium that Playwright already caches (~/.cache/ms-playwright).
 * Run it by hand when a project changes, review the images, and commit them.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { projects } from "../src/content/projects";

interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
  device: "desktop" | "mobile";
}

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "projects");
const manifestPath = path.join(root, "src/content/project-media.generated.ts");

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844, scale: 2 };
const SETTLE_MS = 3500;

async function warm(url: string | undefined) {
  if (!url) return;
  try {
    await fetch(url, { signal: AbortSignal.timeout(60_000) });
  } catch {
    // A cold API that never answers still gets its frontend captured.
  }
}

// Cookie banners and product tours hide the page. Decline cookies (the most
// private choice) and close tours before the shot.
const DISMISS = [/reject all/i, /don.?t show again/i, /^close$/i, /^skip/i];

async function dismissOverlays(page: Page) {
  for (const name of DISMISS) {
    const button = page.getByRole("button", { name }).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click({ timeout: 2000 }).catch(() => undefined);
      await page.waitForTimeout(400);
    }
  }
  await page.keyboard.press("Escape");
}

async function open(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(SETTLE_MS);
  await dismissOverlays(page);
  await page.waitForTimeout(800);
}

async function captureDesktop(
  browser: Browser,
  slug: string,
  url: string,
  title: string,
) {
  const context = await browser.newContext({
    viewport: DESKTOP,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await open(page, url);
  const shots: Shot[] = [];
  const first = `/projects/${slug}/desktop-1.jpg`;
  await page.screenshot({
    path: path.join(root, "public", first),
    type: "jpeg",
    quality: 84,
  });
  shots.push({
    src: first,
    ...DESKTOP,
    alt: `${title}: first screen on desktop`,
    device: "desktop",
  });

  const scrollable = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  if (scrollable > DESKTOP.height * 0.6) {
    await page.evaluate((y) => {
      scrollTo(0, y);
    }, DESKTOP.height);
    await page.waitForTimeout(1200);
    const second = `/projects/${slug}/desktop-2.jpg`;
    await page.screenshot({
      path: path.join(root, "public", second),
      type: "jpeg",
      quality: 84,
    });
    shots.push({
      src: second,
      ...DESKTOP,
      alt: `${title}: further down the page on desktop`,
      device: "desktop",
    });
  }
  await context.close();
  return shots;
}

async function captureMobile(
  browser: Browser,
  slug: string,
  url: string,
  title: string,
) {
  const context = await browser.newContext({
    viewport: { width: MOBILE.width, height: MOBILE.height },
    deviceScaleFactor: MOBILE.scale,
    isMobile: true,
    hasTouch: true,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await open(page, url);
  const src = `/projects/${slug}/mobile-1.jpg`;
  await page.screenshot({
    path: path.join(root, "public", src),
    type: "jpeg",
    quality: 84,
  });
  await context.close();
  return [
    {
      src,
      width: MOBILE.width * MOBILE.scale,
      height: MOBILE.height * MOBILE.scale,
      alt: `${title}: first screen on a phone`,
      device: "mobile",
    } satisfies Shot,
  ];
}

async function main() {
  const only = new Set(process.argv.slice(2));
  interface Links {
    live?: string;
    api?: string;
  }
  const linksOf = (p: (typeof projects)[number]): Links =>
    ("links" in p ? p.links : undefined) ?? {};
  const targets = projects.filter(
    (p) => linksOf(p).live && (only.size === 0 || only.has(p.slug)),
  );
  const browser = await chromium.launch();
  // Keep earlier captures when only some slugs are re-shot.
  const media: Record<string, Shot[]> = await import(manifestPath)
    .then((m: { capturedMedia?: Record<string, Shot[]> }) => ({
      ...m.capturedMedia,
    }))
    .catch(() => ({}));

  for (const project of targets) {
    const url = linksOf(project).live;
    if (!url) continue;
    process.stdout.write(`• ${project.slug} … `);
    await mkdir(path.join(outDir, project.slug), { recursive: true });
    await warm(linksOf(project).api);
    try {
      media[project.slug] = [
        ...(await captureDesktop(browser, project.slug, url, project.title)),
        ...(await captureMobile(browser, project.slug, url, project.title)),
      ];
      console.log(`${String(media[project.slug]?.length)} shots`);
    } catch (error) {
      console.log(
        `failed (${error instanceof Error ? error.message.split("\n")[0] : "unknown"})`,
      );
    }
  }
  await browser.close();

  const body = `// Generated by scripts/capture-screenshots.ts. Do not edit by hand:\n// re-run \`pnpm screenshots\` instead. Review the images before committing.\nimport type { Shot } from "@/lib/schemas/content";\n\nexport const capturedMedia: Record<string, Shot[]> = ${JSON.stringify(media, null, 2)};\n`;
  await writeFile(manifestPath, body);
  console.log(
    `\nWrote ${path.relative(root, manifestPath)} (${String(Object.keys(media).length)} projects)`,
  );
}

await main();
