import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI (migrate, db push, studio, ...) reads the connection URL from
// this config. The runtime client connects via the driver adapter in
// src/lib/prisma.ts instead.
//
// `prisma generate` (postinstall) never touches the database, so the URL is
// optional here — it must be set only for migrate/studio commands. This keeps
// installs working on Vercel even before environment variables are configured.
//
// Migrations take a Postgres advisory lock, which does not work through a
// pooled (pgbouncer) connection such as Neon's `-pooler` host — it times out
// with P1002. So the CLI prefers a direct/unpooled URL when one is provided
// (DIRECT_URL, or DATABASE_URL_UNPOOLED from the Vercel Neon integration).
dotenv.config({ path: ".env.local" });

const cliUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL ??
  "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: cliUrl,
  },
});
