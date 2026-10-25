import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Admin console flows. They need a seeded admin and a database, so they run
// only when E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD are set (CI seeds them).
const EMAIL = process.env.E2E_ADMIN_EMAIL;
const PASSWORD = process.env.E2E_ADMIN_PASSWORD;

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

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/admin/sign-in");
  await page.getByLabel(/^Email/).fill(email);
  await page.getByLabel(/^Password/).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test("signed-out visitors are sent to the sign-in page", async ({ page }) => {
  await page.goto("/admin/users?q=x");
  await expect(page).toHaveURL(
    /\/admin\/sign-in\?next=%2Fadmin%2Fusers%3Fq%3Dx$/,
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Admin sign-in" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
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

test("the password field can be shown and hidden", async ({ page }) => {
  await page.goto("/admin/sign-in");
  const input = page.getByLabel(/^Password/);
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
    await add.getByLabel(/^Full name/).fill("E2E Person");
    await add.getByLabel(/^Email/).fill(email);
    await add.getByLabel(/^Password/).fill(password);
    await add.getByLabel(/^Confirm password/).fill(password);
    await add.getByRole("button", { name: "Create user" }).click();
    await expect(page.getByText("User created.")).toBeVisible();
    await expect(page.getByRole("link", { name: /E2E Person/ })).toBeVisible();

    // Search narrows the table and lands in the URL.
    await page.getByRole("searchbox", { name: "Search users" }).fill(email);
    await expect(page).toHaveURL(/q=e2e-/);

    // Edit.
    await page.getByRole("button", { name: "Actions for E2E Person" }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    const edit = page.getByRole("dialog", { name: "Edit user" });
    await edit.getByLabel(/^Full name/).fill("E2E Renamed");
    await edit.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("link", { name: /E2E Renamed/ })).toBeVisible();

    // Disable, then enable.
    await page.getByRole("button", { name: "Actions for E2E Renamed" }).click();
    await page.getByRole("menuitem", { name: "Disable" }).click();
    await page.getByRole("button", { name: "Disable user" }).click();
    await expect(page.getByText("User disabled and signed out.")).toBeVisible();
    await page.getByRole("button", { name: "Actions for E2E Renamed" }).click();
    await page.getByRole("menuitem", { name: "Enable" }).click();
    await page.getByRole("button", { name: "Enable user" }).click();
    await expect(page.getByText("User enabled.")).toBeVisible();

    // Delete needs the email typed.
    await page.getByRole("button", { name: "Actions for E2E Renamed" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    const del = page.getByRole("dialog", { name: /Delete E2E Renamed/ });
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

    // Sign out, and the console is closed again. The account menu lives at the
    // foot of the sidebar, which is the drawer on phones.
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
    }
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/sign-in/);
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\/sign-in/);
  });

  test("coming-soon modules and the audit log render", async ({ page }) => {
    await signIn(page, EMAIL ?? "", PASSWORD ?? "");
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto("/admin/projects");
    await expect(page.getByText("This module is on the way")).toBeVisible();
    await expectNoSeriousA11yIssues(page);
    await page.goto("/admin/audit-log");
    await expect(
      page.getByRole("heading", { level: 1, name: "Audit log" }),
    ).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });
});
