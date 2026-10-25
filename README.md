# my-portfolio

The personal portfolio of **Md Abdul Mamun**, full-stack software engineer: **Next.js 16 · React 19 · Tailwind v4**, fully static today, with Prisma 7 + PostgreSQL wired in for the planned backend.

- **Pages:** one-page home (hero, stack, about, services, selected work, experience, process), `/about`, `/projects` (filter with `?category=`), `/projects/[slug]` case studies with screenshot galleries, `/contact`, `/privacy-policy`, `/terms-and-conditions`.
- **Look:** the uniqtrix.com style: dark night field with two-colour gradients (active palette violet → indigo; every saved palette is in [src/styles/color-systems](src/styles/color-systems/README.md)), glass surfaces, a Three.js constellation background, and a light theme behind the toggle. See [DESIGN.md](DESIGN.md).
- **Components:** hand-built primitives in `src/components/ui` (Button, ButtonLink, Badge, Card, Dialog, Sheet, Lightbox, Tabs, Accordion, Tooltip, form fields, Marquee, Timeline, StatCounter, Typewriter); no component library.
- **Content:** `src/content/*.ts` read through `src/server/dal/*`, so moving to the database changes one file per domain.
- **Screenshots:** `pnpm screenshots [slug…]` captures live projects with Playwright into `public/projects/`; `pnpm screenshots slug=http://localhost:3006` captures a project from a local server instead.

## Quick start

Requirements: Node.js 22.22.1+ (`.nvmrc` pins 24), pnpm 11, and a PostgreSQL server. Development uses a local PostgreSQL database.

```bash
pnpm install                # also generates the Prisma client (postinstall)
createdb -U postgres next_app_prisma   # a local development database for this project
cp .env.example .env        # set DATABASE_URL, AUTH_SECRET (openssl rand -base64 48), SEED_ADMIN_*
pnpm db:migrate             # apply migrations (enables the citext extension)
pnpm db:seed                # create the default admin (see "Admin console")
pnpm dev                    # http://localhost:3000
```

> Give this project its own database. `pnpm db:migrate` refuses to run against a database whose migration history came from another project, and resolving that requires a reset that deletes its data.

## Admin console

`/admin` is a private, noindex console for managing the site: Auth.js sign-in (email and password, one **Admin** role), user management (add, edit, disable, delete, set or change password), an audit log, and "Coming soon" pages for Projects, Blogs, Professions, Categories, and Settings.

1. Set `DATABASE_URL`, `AUTH_SECRET`, and (optionally) `SEED_ADMIN_EMAIL` / `SEED_ADMIN_NAME` / `SEED_ADMIN_PASSWORD` in `.env`.
2. `pnpm db:migrate && pnpm db:seed` creates the default admin once. With no `SEED_ADMIN_PASSWORD`, a strong password is generated and printed once. Re-running the seed never changes an existing admin (`SEED_ADMIN_RESET=true` resets the password).
3. Sign in at `/admin/sign-in` and change the password from **Account**.

Sessions end after 12 hours, or after 60 minutes without activity, and can be revoked from the Account and user pages. Sign-in is rate limited. In production set `AUTH_SECRET` and `DATABASE_URL`, plus `AUTH_TRUST_HOST=true` behind a proxy such as Vercel. The public site still builds and runs without them. How the module is built, and how to add the next one: [ARCHITECTURE.md §4 and §14](ARCHITECTURE.md#14-admin-modules).

## Scripts

| Script                         | What it does                                                                                                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                     | Dev server (Turbopack)                                                                                                                                                                                                  |
| `pnpm build` / `pnpm start`    | Generate the Prisma client, then a standalone production build (static assets copied in) / run `.next/standalone/server.js`                                                                                             |
| `pnpm typecheck`               | Generate route types (`next typegen`), then `tsc --noEmit`                                                                                                                                                              |
| `pnpm lint` / `lint:fix`       | ESLint (Next.js + typescript-eslint strict, type-aware)                                                                                                                                                                 |
| `pnpm format` / `format:check` | Format with Prettier / check formatting (CI)                                                                                                                                                                            |
| `pnpm test`                    | Vitest unit and content tests (`tests/unit`)                                                                                                                                                                            |
| `pnpm test:e2e`                | Playwright + axe tests (`tests/e2e`) against the standalone build; run `pnpm build` first, or set `BASE_URL`. The admin specs also need `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (a seeded admin) and skip without them |
| `pnpm db:generate`             | Generate the Prisma client (`pnpm install` does it; rerun after every schema change, then restart the editor's TS and ESLint servers)                                                                                   |
| `pnpm db:migrate`              | Create and apply a migration in development                                                                                                                                                                             |
| `pnpm db:push`                 | Push the schema without a migration (prototyping only)                                                                                                                                                                  |
| `pnpm db:seed`                 | Run `prisma/seed.ts` (creates the default admin)                                                                                                                                                                        |

## Project layout

```
prisma/schema/        Prisma schema (multi-file)
prisma/migrations/    SQL migrations (committed)
prisma/seed.ts        Seed script
prisma.config.ts      Prisma 7 config (schema path, datasource URL, seed command)
prisma.compute.ts     Prisma Compute deploy config
src/app/              Next.js App Router (globals.css holds the Tailwind v4 design tokens)
src/components/       Shared components: ui/ primitives, forms/ (react-hook-form + Server Action hooks), admin/ (shell, nav registry)
src/env.ts            Zod-validated environment (the only reader of process.env)
src/server/db.ts      Prisma client singleton (server-only, connects on first use)
src/server/auth.ts    Auth.js config (credentials + server-side sessions)
src/server/cache.ts   Tagged data cache helpers (cached, expireNow, refreshSoon)
src/server/dal/       Data access layer: every DB read/write, with authorization
src/server/actions/   Server Actions ("use server"): the only mutation path
src/app/admin/        The admin console (routes, per-route _components)
scripts/              Build helpers
src/generated/prisma  Generated Prisma client (gitignored)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full target structure, layering rules, and the design of each area.

## Environment variables

See [`.env.example`](.env.example). `DATABASE_URL` and `AUTH_SECRET` are required for `/admin` only. The full list of variables is in [ARCHITECTURE.md §13](ARCHITECTURE.md#13-environments-and-deployment).

## Deployment

`pnpm build` produces a standalone Node server in `.next/standalone` and copies `.next/static` (and `public/`, if present) into it. `pnpm start` runs that server.

`pnpm build` runs `prisma generate` first, because `src/generated/` is gitignored. Hosts that build from a clean checkout (such as Vercel) need no extra step and no `DATABASE_URL` or `AUTH_SECRET` to build: the public pages are static, and `/admin` is rendered on demand.

**Vercel (production):** the live site deploys from `main` to `portfolio-mamun.vercel.app`. On Vercel the standalone output and its copy script are unused but harmless. If the site moves to a custom domain, set `NEXT_PUBLIC_SITE_URL` for the **build** (it's inlined), or canonicals, the sitemap, and JSON-LD keep pointing at the old host. Old URLs from the previous portfolio redirect through `next.config.ts`; after launch, submit `/sitemap.xml` in Search Console.

**Prisma Compute (alternative):** put the production values (at least `DATABASE_URL` for the hosted database) in `.env.compute`, which is gitignored. `prisma.compute.ts` deploys with that file. Never put production values in `.env`: every local command (`pnpm dev`, `db:migrate`, `db:seed`) reads it. Then run:

```bash
pnpm dlx @prisma/cli@8.0.0-rc.20 app deploy
```

Or run the standalone build on any Node 22.22.1+ host.

**Migrations** are not part of the deploy. Run `pnpm exec prisma migrate deploy` against the production database, from CI or a machine with dev dependencies installed (the `prisma` CLI is not in the standalone output), before starting the new version. The database must allow the `citext` extension.

## Documentation

| File                               | What it covers                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [README.md](README.md)             | Overview, quick start, scripts, and deployment (this file)                                               |
| [PRODUCT.md](PRODUCT.md)           | Product truth: who the template serves, its purpose, positioning, brand commitments, and principles      |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design: stack decisions, layering, auth, SEO, a11y, security, and the implementation status table |
| [DESIGN.md](DESIGN.md)             | Design system: colour tokens, light/dark theming, typography, component conventions, and UI setup status |
| [AGENTS.md](AGENTS.md)             | Commands, conventions, gotchas, and the definition of done for coding agents                             |
| [CLAUDE.md](CLAUDE.md)             | Claude Code entry point (imports AGENTS.md, adds Claude-specific notes)                                  |
