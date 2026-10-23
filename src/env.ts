import { z } from "zod";

// The only module that reads process.env (AGENTS.md rule 5). Add every new
// variable here and to .env.example.
//
// The site is static today, so nothing here may be required at build time:
// DATABASE_URL is optional until the backend lands, and src/server/db.ts
// checks it when (and only when) the Prisma client is imported.
const schema = z.object({
  DATABASE_URL: z.string().trim().min(1).optional(),
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
