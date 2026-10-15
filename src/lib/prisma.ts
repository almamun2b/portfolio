import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import net from "node:net";

// Node's auto-select (Happy Eyeballs) gives each address a 250ms window by
// default. The route to the Neon endpoint takes ~300ms to establish, so every
// attempt was being aborted before it could complete (AggregateError
// ETIMEDOUT). Give it a generous window.
net.setDefaultAutoSelectFamilyAttemptTimeout(5000);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
