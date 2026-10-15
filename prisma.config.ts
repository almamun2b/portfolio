import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI (migrate, db push, studio, ...) reads the connection URL from
// this config. The runtime client connects via the driver adapter in
// src/lib/prisma.ts instead.
//
// `prisma generate` (postinstall) never touches the database, so the URL is
// optional here — it must be set only for migrate/studio commands. This keeps
// installs working on Vercel even before environment variables are configured.
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
