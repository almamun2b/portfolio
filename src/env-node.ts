import "./load-dotenv";

// src/env.ts for code that runs outside Next.js: prisma.config.ts, prisma/seed.ts,
// playwright.config.ts, tests/e2e, scripts/*. The side-effect import above runs
// first, so .env is loaded before the variables are validated.
export { env } from "./env";
