import { expect, test, type APIRequestContext } from "@playwright/test";
import { env } from "../../src/env-node";

// The JSON API under /api. The first group needs nothing but a running app;
// the second signs in and so needs a seeded admin (E2E_ADMIN_*), like the
// admin console flows.
const EMAIL = env.E2E_ADMIN_EMAIL;
const PASSWORD = env.E2E_ADMIN_PASSWORD;

test("the health check answers in the standard envelope", async ({
  request,
}) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(await response.json()).toMatchObject({
    success: true,
    statusCode: 200,
    data: { status: "ok" },
    path: "/api/health",
  });
});

test("admin endpoints refuse a visitor without a session", async ({
  request,
}) => {
  for (const path of ["/api/users", "/api/audit-logs"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(401);
    expect(await response.json()).toMatchObject({
      success: false,
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
  }
});

test("a cross-site write is blocked before anything else", async ({
  request,
}) => {
  const response = await request.post("/api/users", {
    headers: { origin: "https://evil.example" },
    data: {},
  });
  expect(response.status()).toBe(403);
  expect(await response.json()).toMatchObject({ code: "FORBIDDEN" });
});

test.describe("with a session", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run the signed-in API checks.",
  );
  test.describe.configure({ mode: "serial" });

  // One sign-in for the whole group (the sign-in endpoint is rate limited),
  // through the same credentials endpoint the form posts to.
  let admin: APIRequestContext;

  test.beforeAll(async ({ playwright }, testInfo) => {
    admin = await playwright.request.newContext({
      baseURL: testInfo.project.use.baseURL,
    });
    const csrf = (await (await admin.get("/api/auth/csrf")).json()) as {
      csrfToken: string;
    };
    const response = await admin.post("/api/auth/callback/credentials", {
      form: {
        csrfToken: csrf.csrfToken,
        email: EMAIL ?? "",
        password: PASSWORD ?? "",
      },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(302);
    expect(response.headers()["set-cookie"]).toContain("session-token");
  });

  test.afterAll(async () => {
    await admin.dispose();
  });

  test("lists users with pagination meta", async () => {
    const response = await admin.get("/api/users?limit=10");
    expect(response.status()).toBe(200);
    const body = (await response.json()) as {
      data: { email: string; passwordHash?: string }[];
      meta: { page: number; limit: number; total: number; totalPage: number };
    };
    expect(body.meta).toMatchObject({ page: 1, limit: 10 });
    expect(body.meta.total).toBeGreaterThan(0);
    expect(body.data.some((user) => user.email === EMAIL)).toBe(true);
    // DTOs only: no secrets in the payload.
    expect(JSON.stringify(body)).not.toMatch(/passwordHash|tokenHash/);
  });

  test("an invalid body gets field errors", async () => {
    const response = await admin.post("/api/users", {
      data: { name: "x", email: "nope", password: "short" },
    });
    expect(response.status()).toBe(400);
    const body = (await response.json()) as {
      code: string;
      errors: { field: string }[];
    };
    expect(body.code).toBe("VALIDATION_ERROR");
    expect(body.errors.map((e) => e.field)).toEqual(
      expect.arrayContaining(["name", "email", "password"]),
    );
  });

  test("you can't disable your own account", async () => {
    const list = await admin.get(
      `/api/users?searchTerm=${encodeURIComponent(EMAIL ?? "")}`,
    );
    const me = ((await list.json()) as { data: { id: string }[] }).data[0];
    const response = await admin.patch(`/api/users/${me?.id ?? ""}/status`, {
      data: { status: "DISABLED" },
    });
    expect(response.status()).toBe(409);
    expect(await response.json()).toMatchObject({ code: "CONFLICT" });
  });
});
