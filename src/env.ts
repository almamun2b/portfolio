import { z } from "zod";

// The only module that reads process.env (AGENTS.md rule 5). Add every new
// variable here and to .env.example.
//
// The public site is static, so nothing here may be required at build time:
// DATABASE_URL and AUTH_SECRET are checked when the admin area first needs
// them (src/server/db.ts, src/server/auth.ts), not on import.
// .env.example ships empty values; treat "" as unset.
const blankToUndefined = (value: unknown) => (value === "" ? undefined : value);

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
});

const parsed = schema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  // Inlined at build time for client bundles, so it must be read by name.
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
