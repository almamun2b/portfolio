import { config } from "dotenv";

// Side-effect module: fills process.env from .env. Next.js does this itself for
// the app, so only tools outside it (Prisma CLI, the seed, Playwright, scripts)
// need it. Import it before src/env.ts, which reads process.env on import.
config({ quiet: true });
