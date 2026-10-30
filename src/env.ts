import { z } from "zod";
import { PASSWORD_MIN } from "./lib/auth/password-params";

// The only module that reads process.env (AGENTS.md rule 5). Add every new
// variable here and to .env.example. Config files, the seed, and scripts import
// it through src/env-node.ts, which loads .env first.
//
// The public site is static, so nothing here may be required at build time:
// DATABASE_URL and AUTH_SECRET are checked when the admin area first needs
// them (src/server/db.ts, src/server/auth.ts), not on import.
// .env.example ships empty values; treat "" as unset.
const blankToUndefined = (value: unknown) => (value === "" ? undefined : value);

// Optional text. Passwords are never trimmed.
const optionalText = z.preprocess(
  blankToUndefined,
  z.string().min(1).optional(),
);
// "true"/"false" (also 1/0, yes/no); unset or blank is false.
const flag = z.preprocess(blankToUndefined, z.stringbool().default(false));

const schema = z.object({
  DATABASE_URL: z.string().trim().min(1).optional(),
  // Signs and encrypts the session cookie. Optional at build time; the admin
  // area refuses to sign anyone in without it (src/server/auth.ts).
  AUTH_SECRET: z.preprocess(
    blankToUndefined,
    z.string().trim().min(32).optional(),
  ),
  // true behind a reverse proxy (Vercel, a container platform).
  AUTH_TRUST_HOST: z.preprocess(
    blankToUndefined,
    z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
  ),
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .default("http://localhost:3000")
    .transform((url) => url.replace(/\/+$/, "")),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Default admin, created by `pnpm db:seed` (prisma/seed.ts). The seed
  // requires SEED_ADMIN_PASSWORD when it creates the admin or resets it;
  // optional here so builds without it keep working.
  SEED_ADMIN_EMAIL: z.preprocess(
    blankToUndefined,
    z.string().trim().toLowerCase().min(1).default("admin@example.com"),
  ),
  SEED_ADMIN_NAME: z.preprocess(
    blankToUndefined,
    z.string().trim().min(1).default("Site Admin"),
  ),
  SEED_ADMIN_PASSWORD: z.preprocess(
    blankToUndefined,
    z.string().min(PASSWORD_MIN).optional(),
  ),
  SEED_ADMIN_RESET: flag,

  // Tooling only: Playwright (playwright.config.ts, tests/e2e), the
  // screenshot script (scripts/capture-screenshots.ts), and CI.
  CI: flag,
  // Not checked as a URL: Vite sets BASE_URL="/" under Vitest.
  BASE_URL: z.preprocess(blankToUndefined, z.string().trim().min(1).optional()),
  E2E_ADMIN_EMAIL: optionalText,
  E2E_ADMIN_PASSWORD: optionalText,
  CAPTURE_EMAIL: optionalText,
  CAPTURE_PASSWORD: optionalText,
});

const parsed = schema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  // Inlined at build time for client bundles, so it must be read by name.
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  SEED_ADMIN_RESET: process.env.SEED_ADMIN_RESET,
  CI: process.env.CI,
  BASE_URL: process.env.BASE_URL,
  E2E_ADMIN_EMAIL: process.env.E2E_ADMIN_EMAIL,
  E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD,
  CAPTURE_EMAIL: process.env.CAPTURE_EMAIL,
  CAPTURE_PASSWORD: process.env.CAPTURE_PASSWORD,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
