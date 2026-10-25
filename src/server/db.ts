import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env";
import { PrismaClient } from "@/generated/prisma/client";

// One client (and one connection pool) per process. In development, HMR
// re-evaluates this module, so keep the instance on globalThis instead of
// opening a new pool on every edit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. The admin area needs it.");
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
  });
}

function getClient(): PrismaClient {
  globalForPrisma.prisma ??= createClient();
  return globalForPrisma.prisma;
}

/**
 * The client is created on first use, not on import, so `next build` (and the
 * static public site) works without a database. A missing DATABASE_URL fails
 * with a clear error on the first query instead.
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value: unknown = Reflect.get(client, prop, client);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
