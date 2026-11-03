import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { env } from "../../src/env-node";

// CMS flows: contact messages, categories, projects, blog posts, settings.
// They need a seeded admin and a database, like admin.spec.ts.
const EMAIL = env.E2E_ADMIN_EMAIL;
const PASSWORD = env.E2E_ADMIN_PASSWORD;

test.describe.configure({ mode: "serial" });
test.skip(!EMAIL || !PASSWORD, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD.");

const stamp = Date.now().toString(36);
const category = { name: `E2E Cat ${stamp}`, slug: `e2e-cat-${stamp}` };
const project = { title: `E2E Project ${stamp}`, slug: `e2e-project-${stamp}` };
const post = { title: `E2E Post ${stamp}`, slug: `e2e-post-${stamp}` };

const field = (page: Page, label: RegExp | string) =>
  page.getByLabel(label).filter({ visible: true });

async function expectNoSeriousA11yIssues(page: Page) {
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    axe.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`),
  ).toEqual([]);
}

async function signIn(page: Page) {
  await page.goto("/admin/sign-in");
  await field(page, /^Email/).fill(EMAIL ?? "");
  await field(page, /^Password/).fill(PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function deleteRow(
  page: Page,
  name: string,
  confirmLabel: string,
  phrase: string,
) {
  await page.getByRole("button", { name: `Actions for ${name}` }).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  const dialog = page.getByRole("dialog", {
    name: new RegExp(`Delete .*${name}`),
  });
  await dialog.getByRole("textbox").fill(phrase);
  await dialog.getByRole("button", { name: confirmLabel }).click();
  await expect(dialog).toBeHidden();
}

test("the public pages arrive fully rendered, with no loader", async ({
  request,
}) => {
  for (const path of ["/", "/projects"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain("Multi-store fulfilment");
    expect(html, path).not.toMatch(/aria-busy="true"|data-skeleton/);
  }
});

test("the contact form stores a message the admin can read", async ({
  browser,
}) => {
  const visitor = await (await browser.newContext()).newPage();
  await visitor.goto("/contact");
  await visitor.getByLabel("Your name").fill(`Visitor ${stamp}`);
  await visitor.getByLabel("Your email").fill("visitor@example.com");
  await visitor
    .getByRole("textbox", { name: /^Message/ })
    .fill("Hello, I would like to talk about a project.");
  await visitor.getByRole("button", { name: "Send message" }).click();
  await expect(visitor.getByText("Message sent.")).toBeVisible();
  await visitor.close();

  const admin = await (await browser.newContext()).newPage();
  await signIn(admin);
  await admin.goto(`/admin/messages?searchTerm=Visitor ${stamp}`);
  await expect(
    admin.getByRole("link", { name: `Visitor ${stamp}`, exact: true }),
  ).toBeVisible();
  await expectNoSeriousA11yIssues(admin);
  await admin
    .getByRole("link", { name: `Visitor ${stamp}`, exact: true })
    .click();
  await expect(admin.getByRole("heading", { level: 1 })).toContainText(
    `Visitor ${stamp}`,
  );
  await admin.getByRole("button", { name: "Delete" }).click();
  await admin
    .getByRole("dialog", { name: "Delete this message?" })
    .getByRole("button", { name: "Delete message" })
    .click();
  await expect(admin).toHaveURL(/\/admin\/messages$/);
  await admin.close();
});

test("categories, a project, and a post go from draft to the public site", async ({
  page,
}) => {
  await signIn(page);

  // Category
  await page.goto("/admin/categories");
  await page.getByRole("button", { name: "Add category" }).first().click();
  const drawer = page.getByRole("dialog", { name: "Add category" });
  await drawer.getByLabel("Name").fill(category.name);
  await drawer.getByLabel("Slug").fill(category.slug);
  await drawer.getByRole("button", { name: "Add category" }).click();
  await expect(page.getByText(category.name).first()).toBeVisible();

  // Project: a draft is not public yet.
  await page.goto("/admin/projects/new");
  await field(page, "Title").fill(project.title);
  await field(page, "Slug").fill(project.slug);
  await field(page, "Tagline").fill("A tagline that is long enough to pass.");
  await field(page, "Summary").fill(
    "A summary that is long enough to pass validation.",
  );
  await field(page, "Role line").fill("Sole developer on the whole thing");
  await page.getByRole("checkbox", { name: category.name }).check();
  await page.getByRole("checkbox", { name: "React", exact: true }).check();
  await field(page, "The problem").fill("The problem statement for the test.");
  await field(page, "Approach").fill("First point\nSecond point");
  await field(page, "Outcomes").fill("One outcome");
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page).toHaveURL(/\/admin\/projects\/[a-z0-9]+$/);
  // Wait for the edit page itself: the URL changes before its content arrives.
  await expect(
    page.getByRole("heading", { level: 1, name: project.title }),
  ).toBeVisible();
  // Not found for visitors: the page streams the 404 UI and marks it noindex.
  const draft = await (
    await page.request.get(`/projects/${project.slug}`)
  ).text();
  expect(draft).toContain('name="robots" content="noindex"');
  expect(draft).not.toContain(project.title);

  // Publish it: it appears in the static project list and its own page.
  await field(page, "Status").selectOption("PUBLISHED");
  await page.getByRole("button", { name: "Save project" }).click();
  await expect(page.getByText("Project saved.")).toBeVisible();
  const list = await (await page.request.get("/projects")).text();
  expect(list).toContain(project.title);
  const detail = await (
    await page.request.get(`/projects/${project.slug}`)
  ).text();
  expect(detail).toContain(project.title);
  expect(detail).toContain("illustration");

  // Post with the rich-text editor
  await page.goto("/admin/blogs/new");
  await field(page, /^Title/).fill(post.title);
  await field(page, "Slug").fill(post.slug);
  await field(page, "Summary").fill("A post summary that is long enough.");
  const editor = page.getByRole("textbox", { name: "Post" });
  await editor.click();
  await page.keyboard.type("Hello from the editor");
  await page.getByRole("button", { name: "Bold" }).click();
  await page.keyboard.type(" and bold text");
  await field(page, "Status").selectOption("PUBLISHED");
  await page.getByRole("button", { name: "Create post" }).click();
  await expect(page).toHaveURL(/\/admin\/blogs\/[a-z0-9]+$/);
  await expect(
    page.getByRole("heading", { level: 1, name: post.title }),
  ).toBeVisible();
  const article = await (await page.request.get(`/blog/${post.slug}`)).text();
  expect(article).toContain("Hello from the editor");
  expect(article).toContain("<strong>");
  const nav = await (await page.request.get("/")).text();
  expect(nav).toContain('href="/blog"');
  await expectNoSeriousA11yIssues(page);

  // Clean up so the run leaves the data as it found it.
  await page.goto(`/admin/blogs?searchTerm=${post.slug}`);
  await deleteRow(page, post.title, "Delete post", post.slug);
  await page.goto(`/admin/projects?searchTerm=${project.slug}`);
  await deleteRow(page, project.title, "Delete project", project.slug);
  await page.goto(`/admin/categories?searchTerm=${category.slug}`);
  await deleteRow(page, category.name, "Delete category", category.slug);
});

test("settings load, validate, and save", async ({ page }) => {
  await signIn(page);
  await page.goto("/admin/settings");
  await expect(
    page.getByRole("heading", { level: 1, name: "Settings" }),
  ).toBeVisible();
  await expectNoSeriousA11yIssues(page);
  await field(page, "WhatsApp number").fill("12");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Digits only, 8 to 15.")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText(/Profile saved/)).toBeVisible();
});
