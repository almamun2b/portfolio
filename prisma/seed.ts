import { hash } from "@node-rs/argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import { ARGON2_PARAMS, PASSWORD_MIN } from "../src/lib/auth/password-params";
import { PrismaClient } from "../src/generated/prisma/client";

// The seed runs under tsx, outside Next.js, so it builds its own client. It
// must not import src/server/*: `server-only` throws outside React Server
// Components. It may import isomorphic src/lib/* files.
config({ quiet: true });

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

function generatePassword(): string {
  // 24 random chars with all four classes, so it passes the app's policy.
  return `Aa1-${randomBytes(18).toString("base64url")}`;
}

/** Creates the default admin once. Re-running never changes an existing account. */
async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com")
    .trim()
    .toLowerCase();
  const name = (process.env.SEED_ADMIN_NAME ?? "Site Admin").trim();
  const supplied = process.env.SEED_ADMIN_PASSWORD;
  const reset = process.env.SEED_ADMIN_RESET === "true";

  if (supplied !== undefined && supplied.length < PASSWORD_MIN) {
    throw new Error(
      `SEED_ADMIN_PASSWORD must be at least ${String(PASSWORD_MIN)} characters`,
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.passwordHash && !reset) {
    console.log(
      `Admin ${email} already exists; left unchanged (SEED_ADMIN_RESET=true to reset the password).`,
    );
    return;
  }

  const password = supplied ?? generatePassword();
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
  console.log(`Seeded admin ${email}.`);
  if (supplied === undefined) {
    console.log(
      `Generated password (shown once, change it after signing in): ${password}`,
    );
  }
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
