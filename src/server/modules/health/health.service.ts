import "server-only";
import { db } from "@/server/core/db";

/** A database round trip, for uptime checks. Throws when the database is down. */
export async function checkDatabase(): Promise<void> {
  await db.$queryRaw`SELECT 1`;
}
