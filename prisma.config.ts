import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ quiet: true });

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    // Not env("DATABASE_URL"): that throws when the variable is unset, and
    // `prisma generate` runs in builds (Vercel) that have no database. Commands
    // that connect (migrate, db, studio) still fail clearly without it.
    url: process.env.DATABASE_URL,
  },
});
