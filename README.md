# my-portfolio

The personal portfolio of **Md Abdul Mamun**, full-stack software engineer: **Next.js 16 · React 19 · Tailwind v4**, fully static today, with Prisma 7 + PostgreSQL wired in for the planned backend.

- **Pages:** one-page home (hero, stack, about, services, selected work, experience, process), `/about`, `/projects` (filter with `?category=`), `/projects/[slug]` case studies with screenshot galleries, `/contact`.
- **Look:** the uniqtrix.com style: dark night field with violet/cyan gradients, glass surfaces, a Three.js constellation background, and a light theme behind the toggle. See [DESIGN.md](DESIGN.md).
- **Components:** hand-built primitives in `src/components/ui` (Button, ButtonLink, Badge, Card, Avatar, Dialog, Sheet, Lightbox, Tabs, Accordion, Tooltip, form fields, Marquee, Timeline, StatCounter, Typewriter); no component library.
- **Content:** `src/content/*.ts` read through `src/server/dal/*`, so moving to the database changes one file per domain.
- **Screenshots:** `pnpm screenshots [slug…]` captures live projects with Playwright into `public/projects/`.

## Quick start

Requirements: Node.js 22.22.1+ (`.nvmrc` pins 24), pnpm 11, and a PostgreSQL server. Development uses a local PostgreSQL database.

```bash
pnpm install
createdb -U postgres next_app_prisma   # a local development database for this project
cp .env.example .env        # set the user and password in DATABASE_URL
pnpm db:generate            # generate Prisma client into src/generated/prisma
pnpm db:migrate             # apply migrations (enables the citext extension)
pnpm db:seed                # seed demo users
pnpm dev                    # http://localhost:3000
```

> Give this project its own database. `pnpm db:migrate` refuses to run against a database whose migration history came from another project, and resolving that requires a reset that deletes its data.

## Scripts

| Script                         | What it does                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `pnpm dev`                     | Dev server (Turbopack)                                                                   |
| `pnpm build` / `pnpm start`    | Standalone production build (static assets copied in) / run `.next/standalone/server.js` |
| `pnpm typecheck`               | Generate route types (`next typegen`), then `tsc --noEmit`                               |
| `pnpm lint` / `lint:fix`       | ESLint (Next.js + typescript-eslint strict, type-aware)                                  |
| `pnpm format` / `format:check` | Format with Prettier / check formatting (CI)                                             |
| `pnpm db:generate`             | Generate the Prisma client (run after every schema change)                               |
| `pnpm db:migrate`              | Create and apply a migration in development                                              |
| `pnpm db:push`                 | Push the schema without a migration (prototyping only)                                   |
| `pnpm db:seed`                 | Run `prisma/seed.ts`                                                                     |

## Project layout

```
prisma/schema/        Prisma schema (multi-file)
prisma/migrations/    SQL migrations (committed)
prisma/seed.ts        Seed script
prisma.config.ts      Prisma 7 config (schema path, datasource URL, seed command)
prisma.compute.ts     Prisma Compute deploy config
src/app/              Next.js App Router (globals.css holds the Tailwind v4 design tokens)
src/components/       Shared components (ThemeProvider)
src/env.ts            Zod-validated environment (the only reader of process.env)
src/server/db.ts      Prisma client singleton (server-only)
src/server/dal/       Data access layer: every DB read/write
scripts/              Build helpers
src/generated/prisma  Generated Prisma client (gitignored)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full target structure, layering rules, and the design of each area.

## Environment variables

See [`.env.example`](.env.example). The full list of planned variables is in [ARCHITECTURE.md §13](ARCHITECTURE.md#13-environments-and-deployment).

## Deployment

`pnpm build` produces a standalone Node server in `.next/standalone` and copies `.next/static` (and `public/`, if present) into it. `pnpm start` runs that server.

**Prisma Compute:** put the production values (at least `DATABASE_URL` for the hosted database) in `.env.compute`, which is gitignored. `prisma.compute.ts` deploys with that file. Never put production values in `.env`: every local command (`pnpm dev`, `db:migrate`, `db:seed`) reads it. Then run:

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
