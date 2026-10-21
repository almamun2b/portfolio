/**
 * Captures project screenshots and writes src/content/project-media.generated.ts.
 *
 *   pnpm screenshots                       # all projects with a live link
 *   pnpm screenshots travel-buddy          # only the slugs you pass
 *   pnpm screenshots now-health=http://localhost:3006/en
 *                                          # a project from a local server
 *
 * `slug=url` captures that project from the URL even without a live link
 * (private or unreleased work run locally). Per-project extras (more pages,
 * a sign-in, areas to blur, captions) are in TARGETS below. Sign-ins read
 * CAPTURE_EMAIL and CAPTURE_PASSWORD from the environment; never commit them.
 *
 * Uses the Chromium that Playwright already caches (~/.cache/ms-playwright).
 * Run it by hand when a project changes, review every image (anonymization:
 * no client names, store URLs, or personal data), and commit them.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  chromium,
  type Browser,
  type BrowserContextOptions,
  type Page,
} from "playwright";
import { projects } from "../src/content/projects";

interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
  device: "desktop" | "mobile";
}

interface Target {
  /** Alt text for the default shots: what each screen shows. */
  captions?: { first?: string; second?: string; mobile?: string };
  /** More desktop pages after the first screen, e.g. an app's dashboard. */
  pages?: { path: string; caption: string }[];
  /** Sign in first (path of the login page) with CAPTURE_EMAIL/PASSWORD. */
  login?: string;
  /** Selectors blurred before every shot (names, emails, URLs, accounts). */
  redact?: string[];
}

const TARGETS: Record<string, Target> = {
  "nextjs-starter-template": {
    captions: {
      first:
        "starter home page in dark mode, with a login link and dashboard call to action",
      mobile: "starter home page on a phone",
    },
  },
  "now-health": {
    captions: {
      first: "home page hero with the plan finder",
      second: "insurance products and services further down the home page",
      mobile: "home page on a phone",
    },
  },
  "team-hub": {
    captions: {
      first: "landing page",
      second: "feature overview further down the landing page",
      mobile: "landing page on a phone",
    },
    login: "/login",
    pages: [
      { path: "/dashboard", caption: "dashboard with team metrics and charts" },
      { path: "/kanban", caption: "kanban board of action items" },
      { path: "/goals", caption: "goals and milestones" },
    ],
  },
  "linkedin-lead-generation": {
    login: "/login",
    pages: [
      { path: "/jobs", caption: "job queue dashboard" },
      { path: "/searches", caption: "saved searches with filters" },
      { path: "/leads", caption: "lead list with enrichment status" },
    ],
    // Personal data and account details stay unreadable.
    redact: ["td", "input", "[data-email]", "a[href^='mailto:']"],
  },
};

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
const DISMISS = [
  /reject all/i,
  /^decline/i,
  /accept necessary/i,
  /don.?t show again/i,
  /^close$/i,
  /^skip/i,
];

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

async function open(page: Page, url: string, target: Target) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(SETTLE_MS);
  await dismissOverlays(page);
  // Hide the Next.js dev-tools badge when capturing a local dev server.
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  if (target.redact?.length)
    await page.addStyleTag({
      content: `${target.redact.join(",")}{filter:blur(8px)!important}`,
    });
  await page.waitForTimeout(800);
}

async function signIn(page: Page, base: string, loginPath: string) {
  const email = process.env.CAPTURE_EMAIL;
  const password = process.env.CAPTURE_PASSWORD;
  if (!email || !password)
    throw new Error("set CAPTURE_EMAIL and CAPTURE_PASSWORD to sign in");
  await page.goto(new URL(loginPath, base).toString(), {
    waitUntil: "networkidle",
  });
  await page
    .locator('input[type="email"], input[name="email"]')
    .first()
    .fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith(loginPath), {
      timeout: 30_000,
    }),
    page.locator('button[type="submit"]').first().click(),
  ]);
}

async function shoot(page: Page, src: string) {
  await page.screenshot({
    path: path.join(root, "public", src),
    type: "jpeg",
    quality: 84,
  });
}

async function captureDesktop(
  browser: Browser,
  slug: string,
  url: string,
  title: string,
  target: Target,
) {
  const context = await browser.newContext({
    viewport: DESKTOP,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const shots: Shot[] = [];
  const add = async (caption: string) => {
    const src = `/projects/${slug}/desktop-${String(shots.length + 1)}.jpg`;
    await shoot(page, src);
    shots.push({
      src,
      ...DESKTOP,
      alt: `${title}: ${caption}`,
      device: "desktop",
    });
  };

  await open(page, url, target);
  await add(target.captions?.first ?? "first screen on desktop");
  const scrollable = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  if (scrollable > DESKTOP.height * 0.6) {
    await page.evaluate((y) => {
      scrollTo(0, y);
    }, DESKTOP.height);
    await page.waitForTimeout(1200);
    await add(target.captions?.second ?? "further down the page on desktop");
  }
  const canSignIn = Boolean(
    process.env.CAPTURE_EMAIL && process.env.CAPTURE_PASSWORD,
  );
  if (target.login && !canSignIn && target.pages?.length)
    process.stdout.write(
      "(no CAPTURE_EMAIL/PASSWORD: skipping signed-in pages) ",
    );
  else if (target.pages?.length) {
    if (target.login) await signIn(page, url, target.login);
    for (const extra of target.pages) {
      await open(page, new URL(extra.path, url).toString(), target);
      await add(extra.caption);
    }
  }
  await context.close();
  return shots;
}

async function captureMobile(
  browser: Browser,
  slug: string,
  url: string,
  title: string,
  target: Target,
) {
  const options: BrowserContextOptions = {
    viewport: { width: MOBILE.width, height: MOBILE.height },
    deviceScaleFactor: MOBILE.scale,
    isMobile: true,
    hasTouch: true,
    colorScheme: "dark",
    reducedMotion: "reduce",
  };
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await open(page, url, target);
  const src = `/projects/${slug}/mobile-1.jpg`;
  await shoot(page, src);
  await context.close();
  return [
    {
      src,
      width: MOBILE.width * MOBILE.scale,
      height: MOBILE.height * MOBILE.scale,
      alt: `${title}: ${target.captions?.mobile ?? "first screen on a phone"}`,
      device: "mobile",
    } satisfies Shot,
  ];
}

/** `slug` or `slug=url` arguments → slugs to capture, with URL overrides. */
function parseArgs(args: string[]) {
  const only = new Set<string>();
  const urls = new Map<string, string>();
  for (const arg of args) {
    const [slug = "", url] = arg.split(/=(.*)/s);
    only.add(slug);
    if (url) urls.set(slug, url);
  }
  return { only, urls };
}

async function main() {
  const { only, urls } = parseArgs(process.argv.slice(2));
  interface Links {
    live?: string;
    api?: string;
  }
  const linksOf = (p: (typeof projects)[number]): Links =>
    ("links" in p ? p.links : undefined) ?? {};
  const urlOf = (p: (typeof projects)[number]) =>
    urls.get(p.slug) ?? linksOf(p).live;
  const targets = projects.filter(
    (p) => urlOf(p) && (only.size === 0 || only.has(p.slug)),
  );
  const browser = await chromium.launch();
  // Keep earlier captures when only some slugs are re-shot.
  const media: Record<string, Shot[]> = await import(manifestPath)
    .then((m: { capturedMedia?: Record<string, Shot[]> }) => ({
      ...m.capturedMedia,
    }))
    .catch(() => ({}));

  for (const project of targets) {
    const url = urlOf(project);
    if (!url) continue;
    const target = TARGETS[project.slug] ?? {};
    process.stdout.write(`• ${project.slug} … `);
    await mkdir(path.join(outDir, project.slug), { recursive: true });
    await warm(linksOf(project).api);
    try {
      media[project.slug] = [
        ...(await captureDesktop(
          browser,
          project.slug,
          url,
          project.title,
          target,
        )),
        ...(await captureMobile(
          browser,
          project.slug,
          url,
          project.title,
          target,
        )),
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
