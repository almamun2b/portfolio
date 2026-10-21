# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, opencode, Cursor, …) working in this repository. Humans should start with [README.md](README.md).

| Doc                                | Read it for                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [PRODUCT.md](PRODUCT.md)           | Who the site serves (recruiters and contract clients), the owner's facts, what must stay anonymized, and what must never be invented |
| [ARCHITECTURE.md](ARCHITECTURE.md) | The target system design, per-area rules (auth §4, SEO §5, UI §7, a11y §9, security §11), and the Implementation status table        |
| [DESIGN.md](DESIGN.md)             | Design tokens, dark mode, typography, `cva`/`cn` component patterns, and what is still missing from the UI setup                     |
| [README.md](README.md)             | Quick start, scripts, and deployment for humans                                                                                      |
| [CLAUDE.md](CLAUDE.md)             | Claude Code-specific notes on top of this file                                                                                       |

## Project in one paragraph

This is the personal portfolio of Md Abdul Mamun (full-stack software engineer): **Next.js 16 App Router + React 19.3 + Tailwind v4**, fully static today, with **Prisma 7 (PostgreSQL)** kept in place for a planned backend (CMS, stored contact messages, blog). Routes: one-page home, `/about`, `/projects`, `/projects/[slug]` case studies, `/contact`. The visual world is the uniqtrix.com style, pinned by the owner (see DESIGN.md). **ARCHITECTURE.md describes the target, and its "Implementation status" table says what actually exists.** Check that table before you import a planned module, and update it in the same change that implements something.

### Content layer

Content lives in `src/content/*.ts` as plain typed data, validated by the zod schemas in `src/lib/schemas/content.ts`, and is read **only** through async getters in `src/server/dal/*` (`getProfile`, `getProjects`, `getProjectBySlug`, …). Pages never import `src/content` (ESLint `no-restricted-imports` enforces this; `navigation.ts` is the one exception). Moving a domain to Postgres means rewriting its DAL file and keeping the function signatures and DTO shapes.

- Project screenshots: `pnpm screenshots [slug…]` (scripts/capture-screenshots.ts, Playwright with the cached Chromium) writes `public/projects/<slug>/*.jpg` and `src/content/project-media.generated.ts`. Review the images before committing. Hand-picked images for private work go in `project-media.manual.ts`, after checking them for client names, logos, store URLs, and personal data.
- Xubitar and Devxhub client work is **anonymized**: no client, product, or store names anywhere, including alt text, and no links to the client's product. Projects without public screenshots use a designed cover labelled "illustration".
- Never add testimonials, client logos, or unverifiable numbers; stats are derived from content.

## This is not the Next.js or Prisma you remember

Your training data likely predates these versions. Read the bundled docs before writing framework code:

- Next.js docs for the installed version: `node_modules/next/dist/docs/` (`01-app/…`). Key guides: `02-guides/authentication.md`, `data-security.md`, `content-security-policy.md`, `json-ld.md`, `upgrading/version-16.md`.
- Prisma skills: `.claude/skills/prisma-*` (mirrored in `.agents/skills/`).

Breaking changes that bite most often:

- **Next 16:** `middleware.ts` is renamed **`proxy.ts`** (export `proxy`, Node runtime). It lives at `src/proxy.ts`. `params`, `searchParams`, `cookies()`, and `headers()` are **async only**. Turbopack is the default bundler. `next lint` is gone (use `pnpm lint`), and `next build` no longer lints. The `id` argument of `sitemap()` and the `params` of image-metadata functions are now promises. Use `PageProps<'/route'>` / `LayoutProps` global types (`pnpm exec next typegen`).
- **Prisma 7:** the datasource URL lives in `prisma.config.ts`, not the schema. The client is generated to `src/generated/prisma` and imported from **`../generated/prisma/client`**, not `@prisma/client`. A driver adapter (`PrismaPg`) is required. `migrate dev` **no longer runs `generate` or `seed`**, so run them explicitly. The schema is a **folder** (`prisma/schema/`); add new models as new `.prisma` files there.

## Commands

The package manager is pnpm (v11). Don't use npm or yarn.

```bash
pnpm install                 # then: pnpm db:generate (client is gitignored)
pnpm dev                     # http://localhost:3000
pnpm build && pnpm start     # production build; start runs node .next/standalone/server.js
pnpm typecheck               # next typegen + tsc --noEmit (strict + noUncheckedIndexedAccess)
pnpm lint                    # ESLint: next core-web-vitals + typescript-eslint strictTypeChecked
pnpm lint:fix                # ESLint with --fix
pnpm format                  # Prettier (+ Tailwind class sorting)
pnpm format:check            # what CI runs

pnpm db:generate             # regenerate Prisma client — after every schema change
pnpm db:migrate --name <x>   # create + apply a migration (dev)
pnpm db:seed                 # run prisma/seed.ts (idempotent upserts)
pnpm db:push                 # prototyping only; never for changes that ship
pnpm exec prisma migrate status
pnpm exec prisma studio
```

Tests: `pnpm test` (Vitest, `tests/unit`; a single test is `pnpm test tests/unit/dates.test.ts -t "name"`) and `pnpm test:e2e` (Playwright + axe smoke tests in `tests/e2e`, run against the standalone build, so `pnpm build` first or set `BASE_URL`; a single test is `pnpm test:e2e tests/e2e/smoke.spec.ts -g "name"`). Both run in CI.

Tooling is pinned on purpose: **ESLint 9** (the plugins inside `eslint-config-next` don't support ESLint 10 yet) and **TypeScript `~6.0`** (typescript-eslint doesn't support TypeScript 7 yet). Don't bump either major until `eslint-config-next` and `typescript-eslint` support it.

### Git hooks and commits

Husky installs the hooks on `pnpm install` (`prepare` script):

- `pre-commit` runs lint-staged (`lint-staged.config.mjs`): `eslint --fix` and `prettier --write` on staged files.
- `commit-msg` runs commitlint. Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `ci:`, `build:`, `style:`, `test:`, `perf:`, `revert:`), optionally with a scope (`feat(auth): …`).
- `pre-push` runs `pnpm typecheck`.

Don't bypass hooks with `--no-verify`. CI (`.github/workflows/ci.yml`) runs the same checks plus `prisma validate`/`format --check`, `pnpm build`, a report-only `pnpm audit`, a migrations-vs-schema drift check against a Postgres service, and commitlint on every pushed or PR commit. Dependabot (`.github/dependabot.yml`) opens weekly update PRs.

When pnpm prompts about an install script from a new dependency, add the package to `allowBuilds` in `pnpm-workspace.yaml` instead of disabling the check.

## Current gotchas

- The site is static: nothing imports `src/server/db.ts` yet, so `DATABASE_URL` is optional and `pnpm build` works without a database. `db.ts` throws on import if it's unset, so the first DAL function that moves to Postgres makes it required.
- Only one `next dev` may run per project directory (Next 16 refuses a second). Reuse the running server on port 3000.
- `DATABASE_URL` in `.env` points to a **local PostgreSQL** server on `localhost:5432` (user `postgres`, database `next_app_prisma`, used only by this project). If queries fail with connection errors, check that the Postgres server is running (`pg_isready`) and that the database exists. Other databases on that server belong to other projects; never point `DATABASE_URL` at one of them and migrate.
- The schema is a folder, so the generator `output` in `prisma/schema/schema.prisma` is relative to `prisma/schema/` (`../../src/generated/prisma`). A wrong path puts the client in `prisma/src/generated` and leaves the app importing a stale one.
- `prisma/seed.ts` builds its own Prisma client. Scripts run under `tsx` must not import `src/server/*`, because `import "server-only"` throws outside React Server Components.
- `User.email` is `citext` (case-insensitive), so the `user_email_citext` migration enables the `citext` extension. A hosted database must allow it.
- The `@/*` path alias maps to `./src/*` (`@/server/db`, `@/components/ui/button`).
- `src/generated/` is gitignored and must never be edited by hand.
- Tailwind v4 compiles through `postcss.config.mjs` (`@tailwindcss/postcss`). Without that file, Turbopack resolves the `@import`s in `globals.css` itself and fails on `tw-animate-css`, which only exports a `style` condition. See [DESIGN.md › Setup status](DESIGN.md#setup-status).
- `next.config.ts` pins `turbopack.root` and `outputFileTracingRoot` to the project directory, because a stray `pnpm-workspace.yaml` in a parent directory otherwise makes Next.js guess the wrong root. Keep both set to the same path.

## Architecture rules (non-negotiable)

These are summarised from ARCHITECTURE.md §3–§11. Follow them even while the rest of the target structure is still being built.

1. **Layering:** page / Server Action / route handler → `src/server/dal/*` → `src/server/db.ts`. Only the DAL imports the Prisma client. Files under `src/server/` start with `import "server-only"`.
2. **Authorization happens in the DAL and in every Server Action.** `proxy.ts` redirects are UX only, never the security check. Admin-only resources respond with `notFound()` for non-admins.
3. **Every Server Action and route handler validates input with Zod.** Return typed `{ ok: true, data } | { ok: false, error, fieldErrors? }` results. Don't throw to the client.
4. **Return DTOs, not Prisma models.** Always `select` explicit fields. Never send password hashes, tokens, or session secrets to Client Components.
5. **Only `src/env.ts` reads `process.env`.** Add every new variable there and in `.env.example`.
6. **Admin mutations and security-relevant auth events write an `AuditLog` row.**
7. **Schema changes go through migrations:** edit `prisma/schema/*.prisma`, then `pnpm db:migrate --name <descriptive>`, then `pnpm db:generate`. Commit the migration SQL. Never edit an applied migration.

## Frontend conventions

- Style with the semantic token utilities from [DESIGN.md](DESIGN.md) (`bg-background`, `text-muted-foreground`, `border-input`, …), never raw palette colours or hex. Merge classes with `cn()` from the `cn` package and declare variants with `cva`.
- Use Server Components by default. Put `"use client"` on the smallest leaf possible.
- Forms: Server Action + `useActionState`. They must work without JS, have visible labels, link errors via `aria-describedby`/`aria-invalid`, move focus to the first error, and use correct `autocomplete` tokens.
- Interactive primitives are **hand-built in `src/components/ui/` on native platform features**, by the owner's decision (no shadcn library, no Radix): `Dialog`/`Sheet`/`Lightbox` on the modal `<dialog>` (browser-managed focus trap, Esc, focus return), `Tabs` as a WAI-ARIA tablist with roving tabindex, `Accordion` on `<details>`. Reuse them; don't add a second dialog or tab implementation.
- Scroll reveal is CSS-only (`<Reveal>` + scroll-driven animation in globals.css); never hide content with script, and never wrap the hero.
- Every async segment gets `loading.tsx` (layout-stable skeleton) and `error.tsx`. Mutations show pending, success, and error states, and destructive ones need confirmation.
- List, filter, and pagination state lives in `searchParams`, so URLs are shareable and agent-navigable.
- Images use `next/image` with `sizes`; fonts use `next/font`; third-party scripts use `next/script`. Respect `prefers-reduced-motion`.

## Code size limits

ESLint enforces these as errors, so `pnpm lint`, the pre-commit hook, and CI all fail on a violation. Blank lines and comments don't count.

| Unit                                                                      | Max lines |
| ------------------------------------------------------------------------- | --------- |
| Component file (`*.tsx`)                                                  | 200       |
| Any function: a component body, hook, Server Action, DAL function, helper | 150       |

`src/components/ui/**` (hand-built primitives, one family per file) and test files are exempt. Don't silence the rules with `eslint-disable`; split the code by responsibility instead:

- **Big page or component:** extract sections into subcomponents. Pieces used by one route go in a private `_components/` folder beside it (the `_` keeps it out of routing); shared ones go in `src/components/`.
- **Client logic:** move state and effects into a custom hook (`use-<name>.ts`) next to the component, and keep `"use client"` on the leaf that renders.
- **Non-JSX code in a `.tsx` file:** move `cva` variant maps, Zod schemas, types, and pure helpers into a sibling `.ts` file or `src/lib/`.
- **Long Server Action:** keep it to parse → DAL call → revalidate/redirect. The business logic belongs in the DAL, split into named functions.

## SEO checklist for any new public page

- `metadata` / `generateMetadata` with a unique `title` (the template adds the site name) and `description`
- `alternates.canonical` set to the page's path
- Added to `src/app/sitemap.ts` (static list or DB query), unless the page is noindex
- JSON-LD via the builders in `src/lib/jsonld.ts` where a schema.org type applies (`BreadcrumbList` for nested pages)
- One `<h1>`, a logical heading order, and landmarks
- Private areas (`(auth)`, `(app)`, `admin`) inherit `robots: { index: false }` from their group layout; never add them to the sitemap

## Definition of done

Before you call a change complete:

1. `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, and `pnpm test` are clean, and the relevant `pnpm test:e2e` specs pass (e2e includes axe checks).
2. For any schema change: the migration is committed and `pnpm db:generate` has run.
3. For UI changes: run the dev server and exercise the flow in a browser, including keyboard-only use and a narrow (375px) viewport. Passing type checks do not prove a feature works.
4. Update ARCHITECTURE.md's Implementation status table (and DESIGN.md's Setup status and token tables for UI/theme changes), and update `.env.example` and README.md if setup changed.
