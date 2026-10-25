import { hash } from "@node-rs/argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../src/env-node";
import { PrismaClient } from "../src/generated/prisma/client";
import { ARGON2_PARAMS } from "../src/lib/auth/password-params";

// The seed runs under tsx, outside Next.js, so it builds its own client. It
// must not import src/server/*: `server-only` throws outside React Server
// Components. It may import isomorphic src/lib/* files and src/env-node.ts,
// which loads .env and validates every variable (src/env.ts).
const databaseUrl = env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

/** Creates the default admin once. Re-running never changes an existing account. */
async function seedAdmin() {
  const {
    SEED_ADMIN_EMAIL: email,
    SEED_ADMIN_NAME: name,
    SEED_ADMIN_PASSWORD: supplied,
    SEED_ADMIN_RESET: reset,
  } = env;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.passwordHash && !reset) {
    console.log(
      `Admin ${email} already exists; left unchanged (SEED_ADMIN_RESET=true to reset the password).`,
    );
    return;
  }

  if (!supplied) {
    throw new Error(
      "SEED_ADMIN_PASSWORD is required when the seed creates the admin or resets its password (SEED_ADMIN_RESET=true).",
    );
  }
  const password = supplied;
  const passwordHash = await hash(password, ARGON2_PARAMS);
  const data = {
    name,
    passwordHash,
    passwordChangedAt: new Date(),
    role: "ADMIN" as const,
    status: "ACTIVE" as const,
  };
  await prisma.user.upsert({
    where: { email },
    update: data,
    create: { email, ...data },
  });
  console.log(`Seeded admin ${email}. Change the password after signing in.`);
}

seedAdmin()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
