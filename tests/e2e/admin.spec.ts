import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { env } from "../../src/env-node";

// Admin console flows. They need a seeded admin and a database, so they run
// only when E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD are set (CI seeds them).
const EMAIL = env.E2E_ADMIN_EMAIL;
const PASSWORD = env.E2E_ADMIN_PASSWORD;

test.describe.configure({ mode: "serial" });

async function expectNoSeriousA11yIssues(page: Page) {
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = axe.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`),
  ).toEqual([]);
}

// Label locators also match hidden nodes, and React briefly keeps a hidden copy
// of any content it streams in. Ask for the visible field so a page that
// streams can't make these tests flaky.
const visibleField = (page: Page, label: RegExp) =>
  page.getByLabel(label).filter({ visible: true });

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/admin/sign-in");
  await visibleField(page, /^Email/).fill(email);
  await visibleField(page, /^Password/).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test("signed-out visitors are sent to the sign-in page", async ({ page }) => {
  await page.goto("/admin/users?searchTerm=x");
  await expect(page).toHaveURL(
    /\/admin\/sign-in\?next=%2Fadmin%2Fusers%3FsearchTerm%3Dx$/,
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Admin sign-in" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("cookies this app can't read just mean signed out", async ({
  context,
  page,
  baseURL,
}) => {
  // One under our own name (an old secret) and one under Auth.js's default
  // name (another app on the same localhost). Neither may break the page.
  const url = baseURL ?? "http://localhost:3100";
  await context.addCookies([
    { name: "portfolio-admin.session-token", value: "not-a-token", url },
    { name: "authjs.session-token", value: "not-a-token", url },
  ]);
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/sign-in/);
  await expect(visibleField(page, /^Email/)).toBeVisible();
  expect(errors).toEqual([]);
});

test("the sign-in page has no serious accessibility issues", async ({
  page,
}) => {
  await page.goto("/admin/sign-in");
  await expectNoSeriousA11yIssues(page);
});

test("a wrong password gives one generic message", async ({ page }) => {
  // A throwaway address keeps this test from using up the admin's attempts.
  await signIn(
    page,
    `nobody-${String(Date.now())}@example.com`,
    "wrong-password-1",
  );
  await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/sign-in/);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the sign-in form is in the prerendered HTML", async ({ page }) => {
    // A form that streams in behind <Suspense> only becomes visible once a
    // script moves it into place; this one must be there on the first paint.
    await page.goto("/admin/sign-in");
    await expect(page.getByLabel(/^Email/)).toHaveCount(1);
    await expect(page.getByLabel(/^Email/)).toBeVisible();
    await expect(page.getByLabel(/^Password/)).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});

test("the password field can be shown and hidden", async ({ page }) => {
  await page.goto("/admin/sign-in");
  const input = visibleField(page, /^Password/);
  await input.fill("hunter2-hunter2");
  await expect(input).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(input).toHaveAttribute("type", "text");
});

test.describe("signed in", () => {
  test.skip(!EMAIL || !PASSWORD, "set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");

  test("manage a user end to end", async ({ page }, testInfo) => {
    const stamp = `${testInfo.project.name}-${String(Date.now())}`;
    const email = `e2e-${stamp}@example.com`;
    const password = "E2e-secret-pass-1";
    // Both projects run at once against one database, and failed runs can leave
    // users behind: names must be unique per run.
    const person = `E2E Person ${stamp}`;
    const renamed = `E2E Renamed ${stamp}`;

    await signIn(page, EMAIL ?? "", PASSWORD ?? "");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Welcome back",
    );
    await expectNoSeriousA11yIssues(page);

    // Navigation: the drawer on phones, the sidebar from lg.
    const nav = page.getByRole("navigation", { name: "Admin" });
    if (testInfo.project.name === "mobile") {
      await expect(nav).toBeHidden();
      await page.getByRole("button", { name: "Open navigation" }).click();
    }
    await nav.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL(/\/admin\/users$/);
    await expectNoSeriousA11yIssues(page);

    // Create, with client-side validation first.
    await page.getByRole("button", { name: "Add user" }).first().click();
    const add = page.getByRole("dialog", { name: "Add user" });
    await add.getByRole("button", { name: "Create user" }).click();
    await expect(add.getByText(/Enter a name/)).toBeVisible();
    await add.getByLabel(/^Full name/).fill(person);
    await add.getByLabel(/^Email/).fill(email);
    await add.getByLabel(/^Password/).fill(password);
    await add.getByLabel(/^Confirm password/).fill(password);
    await add.getByRole("button", { name: "Create user" }).click();
    await expect(page.getByText("User created.")).toBeVisible();
    await expect(page.getByRole("link", { name: person })).toBeVisible();

    // Search narrows the table and lands in the URL.
    await page.getByRole("searchbox", { name: "Search users" }).fill(email);
    await expect(page).toHaveURL(/searchTerm=e2e-/);

    // Edit.
    await page.getByRole("button", { name: `Actions for ${person}` }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    const edit = page.getByRole("dialog", { name: "Edit user" });
    await edit.getByLabel(/^Full name/).fill(renamed);
    await edit.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("link", { name: renamed })).toBeVisible();

    // Disable, then enable.
    await page.getByRole("button", { name: `Actions for ${renamed}` }).click();
    await page.getByRole("menuitem", { name: "Disable" }).click();
    await page.getByRole("button", { name: "Disable user" }).click();
    await expect(page.getByText("User disabled and signed out.")).toBeVisible();
    await page.getByRole("button", { name: `Actions for ${renamed}` }).click();
    await page.getByRole("menuitem", { name: "Enable" }).click();
    await page.getByRole("button", { name: "Enable user" }).click();
    await expect(page.getByText("User enabled.")).toBeVisible();

    // Delete needs the email typed.
    await page.getByRole("button", { name: `Actions for ${renamed}` }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    const del = page.getByRole("dialog", { name: `Delete ${renamed}` });
    await expect(
      del.getByRole("button", { name: "Delete user" }),
    ).toBeDisabled();
    await del.getByLabel(/Type/).fill(email);
    await del.getByRole("button", { name: "Delete user" }).click();
    await expect(page.getByText("User deleted.")).toBeVisible();

    // Your own row can't be disabled or deleted.
    await page.goto("/admin/users");
    await page
      .getByRole("button", { name: /^Actions for / })
      .first()
      .waitFor();
    await page
      .getByRole("searchbox", { name: "Search users" })
      .fill(EMAIL ?? "");
    await page
      .getByRole("button", { name: /^Actions for / })
      .first()
      .click();
    await expect(
      page.getByRole("menuitem", { name: "Delete" }),
    ).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("Escape");

    // Sign out, and the console is closed again. The account menu lives at
    // the bottom of the sidebar, which is the drawer on phones.
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
    }
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/sign-in/);
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\/sign-in/);
  });

  test("clicking through the sidebar never shows a loading skeleton", async ({
    page,
  }, testInfo) => {
    // React keeps any Suspense fallback on screen for at least 300 ms, even
    // when the (cached) data arrives in about 40 ms. Admin pages therefore have
    // no loading boundary: a click keeps the current page until the next one
    // is ready. This fails if a loading.tsx or Suspense comes back.
    await signIn(page, EMAIL ?? "", PASSWORD ?? "");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /welcome back/i }),
    ).toBeVisible();

    await page.evaluate(() => {
      const watched = window as unknown as { placeholders: number };
      watched.placeholders = 0;
      const main = document.querySelector("main");
      if (!main) return;
      new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (
              node instanceof Element &&
              (node.matches('[role="status"]') ||
                node.querySelector('[role="status"]'))
            ) {
              watched.placeholders += 1;
            }
          }
        }
      }).observe(main, { childList: true, subtree: true });
    });

    const nav = page.getByRole("navigation", { name: "Admin" });
    const visit = async (link: string, heading: string | RegExp) => {
      if (testInfo.project.name === "mobile") {
        await page.getByRole("button", { name: "Open navigation" }).click();
      }
      await nav.getByRole("link", { name: new RegExp(`^${link}`) }).click();
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
    };
    await visit("Users", "Users");
    await visit("Audit log", "Audit log");
    await visit("Projects", "Projects");
    await visit("Dashboard", /welcome back/i);
    await visit("Users", "Users");

    expect(
      await page.evaluate(
        () => (window as unknown as { placeholders: number }).placeholders,
      ),
    ).toBe(0);
  });

  test("rows per page is a dropdown that updates the URL", async ({ page }) => {
    await signIn(page, EMAIL ?? "", PASSWORD ?? "");
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto("/admin/audit-log");
    const rows = page.getByLabel("Rows per page");
    await expect(rows.locator("option")).toHaveText(["10", "25", "50"]);
    await rows.selectOption("25");
    await expect(page).toHaveURL(/\/admin\/audit-log\?limit=25$/);
    await expect(rows).toHaveValue("25");
    await rows.selectOption("10");
    await expect(page).toHaveURL(/\/admin\/audit-log$/);
  });

  test("coming-soon modules and the audit log render", async ({ page }) => {
    await signIn(page, EMAIL ?? "", PASSWORD ?? "");
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto("/admin/projects");
    // By role: React streams the page through a hidden segment that briefly
    // coexists with the swapped-in copy, which a text locator would also match.
    await expect(
      page.getByRole("heading", { name: "This module is on the way" }),
    ).toBeVisible();
    await expectNoSeriousA11yIssues(page);
    await page.goto("/admin/audit-log");
    await expect(
      page.getByRole("heading", { level: 1, name: "Audit log" }),
    ).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });
});
