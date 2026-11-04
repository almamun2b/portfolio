import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/env-node";

// Smoke tests against a production build. CI runs `pnpm build` first; locally
// either do the same, or point BASE_URL at a running server
// (BASE_URL=http://localhost:3000 pnpm test:e2e).
const port = 3100;
const external = env.BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: env.CI,
  retries: env.CI ? 1 : 0,
  reporter: env.CI ? "github" : "list",
  use: {
    baseURL: external ?? `http://localhost:${String(port)}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  ...(external
    ? {}
    : {
        webServer: {
          command: "node .next/standalone/server.js",
          env: { PORT: String(port), HOSTNAME: "127.0.0.1" },
          url: `http://localhost:${String(port)}`,
          reuseExistingServer: !env.CI,
        },
      }),
});
