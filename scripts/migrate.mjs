// Runs `prisma migrate deploy` as part of the build, except on Vercel preview
// deployments: previews share the database with production, and concurrent
// builds fight over the migration advisory lock (P1002) — a PR preview should
// not be migrating the shared DB anyway.
import { spawnSync } from "node:child_process";

if (process.env.VERCEL_ENV === "preview" && !process.env.FORCE_MIGRATE) {
  console.log("Preview deployment: skipping prisma migrate deploy.");
  process.exit(0);
}

const result = spawnSync("prisma", ["migrate", "deploy"], {
  stdio: "inherit",
  shell: true,
});
process.exit(result.status ?? 1);
