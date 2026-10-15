import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma CLI (migrate, db push, studio, ...) reads the connection URL from
// this config. The runtime client connects via the driver adapter in
// src/lib/prisma.ts instead.
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
