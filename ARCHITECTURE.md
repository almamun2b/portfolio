# Architecture

This is the blueprint for a production-grade full-stack template: **Next.js 16 (App Router) + React 19.3 + Prisma 7 (PostgreSQL)** with authentication, user management, SEO, accessibility, performance, and security built in.

Companion docs: [DESIGN.md](DESIGN.md) is the design system (tokens, theming, typography, component conventions); [AGENTS.md](AGENTS.md) holds the day-to-day rules for coding agents; [README.md](README.md) is the human quick start.

The repository started from the `create-prisma` Next.js scaffold. Much of what follows is the **target** design. Check the [Implementation status](#implementation-status) table before you assume a file or feature exists, and update the table in the same change that implements something.

---

## 1. Stack and decisions

| Concern    | Choice                                                                                                                                                                                                       | Why                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 16 App Router, Turbopack, `output: "standalone"`                                                                                                                                                     | RSC by default, Server Actions, file-based metadata (robots/sitemap/OG). Standalone output is needed for container and Prisma Compute deploys.                        |
| Language   | TypeScript `strict`                                                                                                                                                                                          | —                                                                                                                                                                     |
| Database   | PostgreSQL: a local server in development, a hosted database (for example Prisma Postgres) in production                                                                                                     | —                                                                                                                                                                     |
| ORM        | Prisma 7 with the `prisma-client` generator and the `@prisma/adapter-pg` driver adapter                                                                                                                      | Prisma 7 requires a driver adapter. The client is generated into `src/generated/prisma`.                                                                              |
| Auth       | **Auth.js v5** (`next-auth@5.0.0-beta.32`, exact pin), Credentials provider, JWT cookie backed by a `Session` table, argon2id (`@node-rs/argon2`)                                                            | One admin role and sign-in only, so no OAuth, sign-up, or adapter: we own the `User` and `Session` tables, which lets sessions be revoked server-side. Details in §4. |
| Validation | **Zod**                                                                                                                                                                                                      | One schema per input, shared by client forms and the Server Action or route that receives it. Also validates env vars.                                                |
| UI         | Tailwind CSS v4, hand-built primitives in `src/components/ui` (no shadcn/Radix, owner's decision), `cva`, `cn`, `lucide-react` (UI glyphs), `simple-icons` (tech logos), `next-themes`, `three` (background) | Native `<dialog>`/`<details>` give focus management and keyboard behaviour without a component library. Tokens and conventions: [DESIGN.md](DESIGN.md).               |
| Forms      | **react-hook-form** + `@hookform/resolvers` (Zod) over Server Actions (`useActionForm`)                                                                                                                      | Instant client validation and focus handling, one Zod schema shared with the server, and `<form action>` still posts without JS.                                      |
| Email      | `src/server/email` adapter (console transport in dev, provider in prod)                                                                                                                                      | Needed for verification and reset flows.                                                                                                                              |
| Testing    | Vitest (unit/integration), Playwright + `@axe-core/playwright` (e2e + a11y), Lighthouse CI (perf/SEO/a11y budgets)                                                                                           | —                                                                                                                                                                     |
| Deploy     | Vercel (production: `portfolio-mamun.vercel.app`); the standalone build also runs on any Node host or Prisma Compute (`prisma.compute.ts`)                                                                   | —                                                                                                                                                                     |

To change a decision, edit this table and add a short rationale.

---

## 2. Directory layout

```
prisma/
  schema/               Multi-file Prisma schema (one domain per file)
    schema.prisma         generator + datasource
    auth.prisma           User, Session, RateLimit, Role, UserStatus
    audit.prisma          AuditLog
  migrations/
  seed.ts               Idempotent seed: the default admin (SEED_ADMIN_*)
prisma.config.ts        Prisma 7 config: schema path, migrations, seed, datasource URL
src/
  proxy.ts              Next 16 "proxy" (formerly middleware): /admin redirect when there is no session cookie (UX only)
  env.ts                Zod-validated env; the ONLY place that reads process.env
  app/
    layout.tsx          <html lang>, root metadata, providers
    (site)/             Public, indexable pages (home, about, projects, contact, legal)
    admin/              Private console, noindex (layout.tsx mounts the toaster)
      (auth)/sign-in/     Sign-in page (no shell)
      (dashboard)/        Signed-in shell: layout.tsx (requireAdmin + AdminFrame) and one folder per module
        users/ audit-log/ account/        Built modules
        projects/ blogs/ professions/ categories/ settings/   "Coming soon" placeholders
    api/auth/[...nextauth]/route.ts   Auth.js handlers (GET, POST), the standard mount; the UI never calls it
    robots.ts  sitemap.ts  manifest.ts  opengraph-image.tsx  icon.svg
    not-found.tsx  error.tsx
  components/
    ui/                 Hand-built primitives (button, dialog/sheet, table, data-table, pagination, dropdown, toast, ...)
    forms/              useActionForm (RHF + Server Action), form fields, submit button, useConfirmAction
    admin/              AdminFrame (sidebar, drawer, top bar), nav-config registry, ComingSoon, skeletons, ErrorState
    …                   public-site components
  lib/                  Isomorphic helpers: schemas (Zod), DTO types, url-state, format, auth policy constants
  server/               Server-only code. Everything here starts with `import "server-only"`, except actions/ ("use server")
    db.ts               PrismaClient singleton (created on first query)
    auth.ts             Auth.js config; exports handlers, auth, signIn, signOut
    password.ts         argon2id hash/verify
    cache.ts            Tagged cache helpers: cached(), expireNow(), refreshSoon(), tags
    audit.ts            writeAudit() (no authz; used by Auth.js callbacks and the DAL)
    logger.ts  errors.ts  request-context.ts
    dal/                Data Access Layer: every DB read/write for a domain, with authorization
    actions/            Server Actions ("use server"): thin; action.ts holds adminAction()/publicAction()
  generated/prisma/     Prisma client output (gitignored, never edit)
tests/
  unit/  e2e/
```

Route groups `(site)`, `(auth)`, `(dashboard)` do not appear in URLs. Each group has its own `layout.tsx`, so indexing, shell UI, and auth requirements are set once per group.

---

## 3. Request lifecycle and layering

```
Browser ──► proxy.ts ──► RSC page / Server Action / Route Handler ──► server/dal/* ──► server/db.ts ──► Postgres
             │                    │                                      │
             │ CSP nonce,          │ calls getSession() / requireUser()   │ authorization + DTO shaping
             │ security headers,   │ from dal/auth                        │ (never return raw Prisma rows
             │ optimistic redirect │                                      │  containing secrets)
```

Rules that hold across the codebase:

1. **Only `src/server/dal/*` imports `db`.** Pages, actions, and route handlers call DAL functions. The DAL is where authorization happens.
2. **`proxy.ts` is not a security boundary.** It only does cheap cookie-presence redirects for UX. Every DAL function and Server Action checks the session again. This follows Next's own guidance; a proxy/middleware bypass (for example CVE-2025-29927) must not expose data.
3. **Server Actions are public HTTP endpoints.** Each one: (a) parses input with Zod, (b) authenticates and authorizes through the DAL, (c) returns a typed `ActionResult`, never throws raw errors to the client, (d) invalidates cache tags (`expireNow`) and `redirect`s as needed. `adminAction()` / `publicAction()` in `src/server/actions/action.ts` do (a)–(c) the same way everywhere, plus structured logging with a request id.
4. **DTOs, not models.** The DAL returns plain objects with only the fields the caller needs. `passwordHash`, tokens, and similar fields never cross into a Client Component. Use `import "server-only"` for server modules. `"use server"` goes only on `src/server/actions/*` files: every export of such a file is a public endpoint, so it must never be put on the DAL or helpers.
5. **Env access goes through `src/env.ts`.** Only variables prefixed with `NEXT_PUBLIC_` reach the client, and each one needs a stated reason.

Details: `node_modules/next/dist/docs/01-app/02-guides/data-security.md` and `…/authentication.md`.

---

## 4. Authentication and user management

**As built.** Sign-in only, one role (**Admin**), no sign-up. The default admin is created by `pnpm db:seed` from `SEED_ADMIN_*`.

**Library:** Auth.js v5 (`next-auth@5.0.0-beta.32`, exact pin; read the changelog before bumping), configured in `src/server/auth.ts` and mounted at `src/app/api/auth/[...nextauth]/route.ts`. Server code reads the session through `getSession()` / `getAdmin()` / `requireAdmin()` in `src/server/dal/auth.ts`; the sign-in form calls the `signInAction` Server Action. No `SessionProvider`, no client-side session fetch.

**Sessions:** `session.strategy: "jwt"` (the Credentials provider requires it), used as a pointer to a server-side `Session` row. On sign-in the `jwt` callback creates the row (random 32-byte token; only its SHA-256 is stored) and puts the raw token in the encrypted cookie. On every later request it validates the row: **revoked**, **expired** (12 h absolute), **idle** (60 min since `lastSeenAt`, written at most every 5 min), or **user disabled/missing** all end the session. Pure rules live in `src/lib/auth/session-policy.ts` (unit tested). Cookies keep the Auth.js defaults: `HttpOnly`, `SameSite=Lax`, `Secure` and the `__Secure-` prefix over https.

**Sign-in hardening** (`src/server/dal/credentials.ts`):

- Generic "Email or password is incorrect." for every failure (unknown email, wrong password, disabled account), with a dummy argon2 verify for unknown emails so timing doesn't reveal which exist.
- DB-backed rate limit (`RateLimit`, atomic upsert): 5 attempts per 15 min per IP + email, 30 per IP. It guards the raw `/api/auth` endpoint as well as the form, which shows a friendlier message from a read-only pre-check.
- Every success, failure, and block is written to `AuditLog` with the real reason (never shown to the user).
- `next` after sign-in is validated by `safeAdminPath()` (only `/admin/...`), so it can't be an open redirect.

**Authorization:** `User.role` is the `Role` enum (`ADMIN`). `getAdmin()` re-reads role and status from the database on every request, so disabling or deleting a user takes effect on their next request. `requireAdmin()` redirects to `/admin/sign-in` with no session and `notFound()`s a session without the admin role. DAL writes call `assertAdmin()`, which throws a `DomainError` that the action wrapper turns into a result. `src/proxy.ts` is a UX-only redirect (cookie present or not), never the security check.

**User management (`/admin/users`):** a server-rendered table with URL-driven search, status filter, sorting, and pagination; create and edit in a drawer; row menu with view, edit, set password, disable or enable, and delete (typed-email confirmation). Guards in the DAL: you can't disable or delete yourself, the last active admin can't be disabled or deleted, emails are unique (case-insensitive `citext`). Disabling or setting a password revokes all of that user's sessions. **Account (`/admin/account`):** change your own password (current password required, show/hide inputs, other sessions are signed out) and list or revoke your sessions. **User detail** shows profile, active sessions, and recent audit entries. **Audit log (`/admin/audit-log`)** is read-only, searchable, and filterable.

**Data model:** `User` (`passwordHash`, `role`, `status`, `lastLoginAt`, `passwordChangedAt`), `Session` (`tokenHash`, `expiresAt`, `lastSeenAt`, `revokedAt`, `ip`, `userAgent`), `AuditLog` (`actorId`, `action`, `targetType`, `targetId`, `ip`, `userAgent`, `metadata`), `RateLimit`. Admin writes record their audit row in the same transaction as the change.

**Not built (target, if needed later):** OAuth providers, sign-up and email verification, forgot/reset password by email, 2FA (TOTP), impersonation, scheduled cleanup jobs (expired sessions are pruned opportunistically at sign-in; rate-limit rows at random).

---

## 5. SEO

All SEO primitives use Next's file-based metadata APIs. Do not hand-write `<head>` tags.

| Item               | Implementation                                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Site config        | `src/lib/site.ts`: name, description, canonical origin (`env.NEXT_PUBLIC_SITE_URL`), locale, social handles, default OG image                                                                                                                                                                                                                          |
| Base metadata      | Root `layout.tsx` exports `metadata` with `metadataBase`, `title: { default, template: "%s · Site" }`, `description`, `openGraph`, `twitter`, `robots`, `icons`, `manifest`, `formatDetection`. `viewport` (with a per-scheme `themeColor` that matches `--background`; see [DESIGN.md §3](DESIGN.md#3-theming-and-dark-mode)) is exported separately. |
| Per-page metadata  | `export const metadata` or `generateMetadata()` in every indexable page, with a unique title (≤ 60 chars) and description (≤ 160 chars)                                                                                                                                                                                                                |
| **Canonical**      | Every indexable page sets `alternates: { canonical: "/path" }` (resolved against `metadataBase`). Canonicals drop tracking params and pagination duplicates. The canonical origin is enforced with a single host (www vs apex) and a trailing-slash policy (`trailingSlash: false`).                                                                   |
| **robots.txt**     | `src/app/robots.ts`. Allow `/`. Disallow `/api/`, `/admin/`, `/dashboard`, `/settings`, and auth routes. Points to the sitemap. Non-production environments return `Disallow: /`. AI-crawler policy (GPTBot, ClaudeBot, Google-Extended, …) is configurable in site config.                                                                            |
| **sitemap.xml**    | `src/app/sitemap.ts` lists static marketing routes plus dynamic content from the DB with real `lastModified`. Use `generateSitemaps()` above 50k URLs. Never lists noindex or authenticated routes.                                                                                                                                                    |
| noindex            | `(auth)`, `(app)`, and `admin` layouts export `robots: { index: false, follow: false }`.                                                                                                                                                                                                                                                               |
| **JSON-LD**        | `src/lib/jsonld.ts` contains typed builders (use `schema-dts` types): `Organization` + `WebSite` in the root layout, `BreadcrumbList` on nested pages, and `Article`/`FAQPage`/`Product` where relevant. Render with `<JsonLd data={…} />`, which escapes `<` as `\u003c` (see `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`).             |
| Open Graph images  | `opengraph-image.tsx` (static at root, dynamic per content route) using `next/og`. Size 1200×630.                                                                                                                                                                                                                                                      |
| Icons and manifest | `icon.tsx`, `apple-icon.tsx`, `manifest.ts`                                                                                                                                                                                                                                                                                                            |
| Status codes       | `notFound()` returns a real 404, `permanentRedirect()` a 308 for moved content, and `error.tsx` must not mask 5xx as 200                                                                                                                                                                                                                               |
| i18n (optional)    | If added, use `alternates.languages` for hreflang plus a locale segment                                                                                                                                                                                                                                                                                |

---

## 6. Code validation and web standards

- **Static checks:** ESLint (`eslint-config-next` core-web-vitals + typescript, which includes `jsx-a11y` rules, plus typescript-eslint `strictTypeChecked` + `stylisticTypeChecked` with type-aware linting) and `tsc --noEmit` (`strict`, `noUncheckedIndexedAccess`). Size limits are lint errors: `*.tsx` files at most 200 lines and any function at most 150 (AGENTS.md › Code size limits). Prettier formats, and `eslint-config-prettier` turns off conflicting ESLint rules. Husky runs lint-staged and commitlint (Conventional Commits) locally. Since Next 16, `next build` no longer runs ESLint, so CI must run lint separately.
- **Runtime validation:** Zod at every trust boundary: Server Action input, route handler body/query, `searchParams`, env, webhook payloads, and JSON columns read from the DB.
- **HTML validity:** semantic elements (`header`/`nav`/`main`/`footer`/`article`), one `<h1>` per page, no heading level skips, `<button>` for actions and `<a>`/`<Link>` for navigation, no nested interactive elements, valid `lang`, and `<time dateTime>` for dates. Playwright e2e can run the Nu HTML Checker (`vnu`) on key pages.
- **Structured data:** JSON-LD validated in tests against expected `@type` fields (and manually with Google's Rich Results Test).
- **Typed routes:** enable `typedRoutes` in `next.config.ts` so broken internal links fail the type check.

---

## 7. UI interaction

- Server Components by default. Add `"use client"` only at the leaf that needs state, effects, or browser APIs.
- Every mutation has **pending**, **success**, and **error** states: `useActionForm` (react-hook-form + `useActionState`) for forms, `useConfirmAction` for confirm dialogs, and toasts announced through an `aria-live` region.
- Every async route segment has `loading.tsx` with skeletons that match final layout dimensions (no CLS), and `error.tsx` with a retry button.
- Dialogs, drawers, and confirmations are built on the native modal `<dialog>`; menus on the native Popover API (`Dropdown`). Reuse these; do not add a second implementation or hand-roll focus traps.
- Destructive actions need a confirmation dialog. Account and user deletion additionally require typing a confirmation phrase.
- Tables (admin users): URL-driven state (`?q=&page=&sort=`) so views are shareable and work with back/forward.
- Motion: CSS transitions and View Transitions where they help; always respect `prefers-reduced-motion`.
- Theming: CSS variables with light and dark via `prefers-color-scheme` plus a user override, and no flash of the wrong theme. The default palette is blue-primary and contrast-checked in both themes; adopters re-brand it by swapping tokens. Token names, values, and usage rules are in [DESIGN.md](DESIGN.md).

---

## 8. Performance and speed

Targets (p75, mobile): **LCP < 2.5 s, INP < 200 ms, CLS < 0.1**, and Lighthouse ≥ 95 for Performance, SEO, Accessibility, and Best Practices on marketing pages. Enforced by Lighthouse CI budgets.

- **Rendering:** public pages are static (ISR, daily). Admin pages are dynamic (they read the session) but their **data** is cached with tags, see "Admin caching" below. Never use a blanket `revalidatePath("/")`.
- **Data:** avoid N+1 (use `include`/`select`, or batch). Always `select` only the needed columns. Paginate admin lists and back them with DB indexes (`@@index` on `email`, `createdAt`, `role`). Run independent queries in parallel with `Promise.all`.
- **Assets:** `next/image` with explicit `sizes` and `priority` only on the LCP image. `next/font` (self-hosted, `display: swap`). `next/script` with `strategy="lazyOnload"` for third parties.
- **JS budget:** keep client components small; `dynamic()` import heavy client-only widgets; check `@next/bundle-analyzer` output for regressions.
- **When the UI work starts:** enable `reactCompiler` (needs `babel-plugin-react-compiler`) once there are client components, and `cacheComponents` before writing the marketing pages so `"use cache"` is available from the start.
- **DB connections:** a single `PrismaClient` per process (`globalThis` singleton in dev to survive HMR). Use a pooled connection string in serverless environments.

---

### Admin caching

Public pages use ISR (`revalidate = 86400`), which Cache Components (`"use cache"`) doesn't allow, so the admin uses `unstable_cache` behind **one** module, `src/server/cache.ts`. Moving to `"use cache"` later changes only that file.

- **Reads:** a DAL read first authorizes (`requireAdmin()`, uncached, because the cached function can't read cookies), then returns `cached(keyParts, { tags }, fn)`. Keys include the serialized params. Safety-net TTL is 5 minutes; tags drive freshness.
- **Tags:** `users`, `user:<id>`, `sessions:<userId>`, `audit`, `dashboard` (add a module's tags to `tags` in `cache.ts`).
- **Writes:** inside the DAL after the commit. `expireNow(...tags)` is `revalidateTag(tag, { expire: 0 })`: the next read is a blocking miss, so the admin never sees their own change as stale. `refreshSoon(...tags)` is `revalidateTag(tag, "max")` (stale-while-revalidate), used only for background effects such as last-sign-in time.
- **DTOs** carry dates as ISO strings, because cached values are JSON-serialized.

## 9. Web accessibility (a11y)

Target: **WCAG 2.2 AA**.

- Skip-to-content link as the first focusable element. Landmarks (`header`, `nav[aria-label]`, `main#main`, `footer`).
- Every input has a visible `<label>`. Errors are linked with `aria-describedby`, and the field is marked `aria-invalid`. On a failed submit, focus moves to the first invalid field or to an error summary.
- Visible `:focus-visible` styles with at least 3:1 contrast. Text contrast is at least 4.5:1. Target size is at least 24×24 CSS px.
- After client-side navigation, the route announcer (built into Next) and a focus reset to `<h1>` keep screen readers oriented.
- Icon-only buttons have an `aria-label`. Decorative images use `alt=""`.
- Honor `prefers-reduced-motion` and `prefers-color-scheme`. No content conveyed by color alone.
- Automated: `jsx-a11y` lint plus axe in Playwright on every route (zero violations). Manual: keyboard-only pass and a screen-reader smoke test (VoiceOver/NVDA) for auth and admin flows.

---

## 10. Agentic browsing (AI agents as users)

The site must be operable by AI agents and assistive tech alike. Most of this follows from good a11y.

- **Semantic, labelled UI:** agents navigate the accessibility tree. Every control has an accessible name, and forms use standard `autocomplete` tokens (`email`, `current-password`, `new-password`, `one-time-code`).
- **Stable, meaningful URLs:** state lives in the URL (filters, pagination, tabs), and there are no JS-only navigation dead ends. Core flows work without client JS.
- **Machine-readable content:** JSON-LD on public pages, a clean `sitemap.xml`, and `/llms.txt`, a concise markdown map of public pages and what they are for.
- **Predictable responses:** real HTTP status codes, `Retry-After` on 429, and no infinite scroll without paginated URLs.
- **Policy:** `robots.ts` holds explicit, configurable rules for AI crawlers. Bot protection (rate limits, Turnstile on sign-up) must not block read-only access to public pages.
- **Stable test hooks:** Playwright tests select by role and name (`getByRole`), the same way agents do, so a11y regressions surface as test failures.

---

## 11. Security and governance

**HTTP headers** (set in `proxy.ts`, or `next.config.ts` `headers()` for static values):
`Content-Security-Policy` with a per-request nonce and `'strict-dynamic'` (see `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`), `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (deny camera, mic, geolocation by default), and `frame-ancestors 'none'`. Also `poweredByHeader: false`.

**Application:**

- Authorization lives in the DAL (§3). Every admin endpoint re-checks the role server-side.
- Rate limiting on auth endpoints and expensive Server Actions (`src/server/dal/rate-limit.ts`, DB-backed; Auth.js has none built in).
- CSRF: Server Actions check the `Origin` header (configure `serverActions.allowedOrigins` behind proxies). Auth.js protects its own endpoints with a double-submit CSRF token and trusts only the configured host (set `AUTH_TRUST_HOST=true` behind a reverse proxy). Never mutate on `GET`.
- Auth.js does not store passwords. We hash them with argon2id (`@node-rs/argon2`) in `src/server/password.ts`. Enforce a minimum length of 12. Check against breached-password lists.
- Uploads (if added): validate MIME type and size server-side, and store off-origin.
- Secrets live only in env and are validated at boot. `.env*` is gitignored except `.env.example`.
- Errors: log full details server-side and return generic messages with a correlation ID to the client.

**Governance:**

- `AuditLog` records auth events (sign-in, failed sign-in, password change, 2FA change) and all admin actions. It is append-only and admins can view it.
- Data lifecycle: user data export and account deletion (§4). Set retention periods for sessions, verification tokens, and audit logs, enforced by a scheduled cleanup job.
- Dependencies: pnpm lockfile committed. `pnpm audit` and Dependabot/Renovate in CI. pnpm `allowBuilds` (in `pnpm-workspace.yaml`) allowlists which packages may run install scripts.
- Migrations: only through `prisma migrate` files that are reviewed in PRs. `db push` is for throwaway local prototyping only.
- `SECURITY.md` with a disclosure contact, and `/.well-known/security.txt`.

---

## 12. Observability

`src/instrumentation.ts` (OpenTelemetry) and `instrumentation-client.ts` for client errors and web-vitals reporting (`useReportWebVitals`). Logs are structured JSON with a request ID. Health check at `/api/health` (checks DB connectivity) for the deploy platform.

---

## 13. Environments and deployment

| Env var                                                                          | Scope       | Purpose                                                                                                    |
| -------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                                   | server      | Postgres connection string                                                                                 |
| `AUTH_SECRET`                                                                    | server      | JWT encryption and cookie signing (≥ 32 random bytes: `openssl rand -base64 48`); needed for `/admin` only |
| `AUTH_TRUST_HOST`                                                                | server      | `true` when running behind a reverse proxy                                                                 |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_RESET` | seed script | Default admin for `pnpm db:seed` (read by `prisma/seed.ts`, not `src/env.ts`)                              |
| `EMAIL_FROM`, `EMAIL_PROVIDER_API_KEY`                                           | server      | Transactional email                                                                                        |
| `NEXT_PUBLIC_SITE_URL`                                                           | public      | Canonical origin for metadata, sitemap, and JSON-LD                                                        |
| `APP_ENV`                                                                        | server      | `development`, `preview`, or `production`; controls robots noindex on non-prod                             |

Build: `pnpm build` produces `.next/standalone`. Deploy with Prisma Compute (`prisma.compute.ts`, which reads production values from the gitignored `.env.compute`; `pnpm dlx @prisma/cli@8.0.0-rc.20 app deploy`) or any Node 22.22.1+ host. Run `prisma migrate deploy` from CI or a machine with dev dependencies before starting the new version (the `prisma` CLI is not in the standalone output). The database must allow the `citext` extension.

---

## 14. Admin modules

Every admin module (Projects, Blogs, Professions, Categories, Settings, …) follows the same recipe, so adding one never changes the architecture. Users is the reference implementation; copy it.

1. **Schema:** `prisma/schema/<domain>.prisma`, then `pnpm db:migrate --name <x>` and `pnpm db:generate`. Commit the migration.
2. **Zod schemas:** `src/lib/schemas/<domain>.ts`: the create/update inputs (shared by the form and the action) and a list-params schema with `.catch()` defaults (`listBase`, `sortParam`, `sortDir` from `schemas/common.ts`). DTO types go in `src/lib/dto.ts` (dates as ISO strings, no secrets).
3. **DAL:** `src/server/dal/<domain>.ts`. Reads: `await requireAdmin()`, then `cached([...keyParts], { tags }, fn)` with an explicit `select`. Writes: `assertAdmin()`, check invariants (throw `DomainError`), change + `writeAudit(..., tx)` in one `$transaction`, then `expireNow(...tags)`. Add the module's tags to `tags` in `src/server/cache.ts`.
4. **Actions:** `src/server/actions/<domain>.ts` with `"use server"` at the top; each action is `adminAction(name, schema, (data) => dal.fn(data))`. Nothing else belongs in the file.
5. **Routes:** `src/app/admin/(dashboard)/<domain>/` with `page.tsx` (parse `searchParams` with the schema, call the DAL), `loading.tsx` (skeleton of the same shape), `error.tsx` (`ErrorState`), and private `_components/` (tables use `DataTable` + `Pagination`; forms use `useActionForm`; overlays use `Drawer`, `Dialog`, `ConfirmDialog`).
6. **Navigation:** one entry in `src/components/admin/nav-config.ts` (`status: "ready"`). It feeds the sidebar, the dashboard's module cards, and the breadcrumbs.
7. **Tests and docs:** unit tests for the schemas, an e2e path for the main flow, and a row in the status table below.

Rules that stay the same for every module: Server Components first; all data through Server Actions and the DAL (no client `fetch`, no API routes); every action authenticated, authorized, validated, logged, and returning `ActionResult`; mutations audited; list state in the URL; empty, loading, and error states present.

---

## Implementation status

The public portfolio is built and fully static. The admin console (§4, §14) is built on top of it. Contact messages, the blog, and the content modules remain planned.

| Area                                                                                                                                                                                                                                                                                                                        | Status                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio routes: `/`, `/about`, `/projects` (URL filter `?category=`), `/projects/[slug]` (SSG, `dynamicParams = false`), `/contact`, `/privacy-policy`, `/terms-and-conditions`, 404                                                                                                                                      | ✅ present, all static (○/●), revalidated daily (`revalidate = 86400` in the root layout) so dates and year counts stay current                                                    |
| Redirects from the previous site's URLs and pre-launch slug renames (`next.config.ts` › `legacyRedirects`)                                                                                                                                                                                                                  | ✅ present, covered by an e2e test                                                                                                                                                 |
| Content layer: `src/content/*` + zod schemas (`src/lib/schemas/content.ts`) + DAL getters (`src/server/dal/{profile,projects}.ts`); zod-free label constants in `src/lib/content-labels.ts` for Client Components                                                                                                           | ✅ present; ESLint blocks direct `@/content` imports outside the DAL                                                                                                               |
| Project screenshots: `scripts/capture-screenshots.ts` (Playwright; live URLs or `slug=url` overrides for local servers) + `project-media.{generated,manual}.ts`                                                                                                                                                             | ✅ present                                                                                                                                                                         |
| `@/*` path alias → `./src/*`                                                                                                                                                                                                                                                                                                | ✅ done                                                                                                                                                                            |
| `src/env.ts`                                                                                                                                                                                                                                                                                                                | ✅ `DATABASE_URL` and `AUTH_SECRET` optional at build, `AUTH_TRUST_HOST`, `NEXT_PUBLIC_SITE_URL` with default                                                                      |
| `src/server/db.ts` Prisma client                                                                                                                                                                                                                                                                                            | ✅ present; created on first query, so the public site builds without a database                                                                                                   |
| Tailwind v4 tokens (dark default + light; swappable palettes saved in `src/styles/color-systems/`, active violet → indigo, contrast-tested), hand-built UI primitives (sliding tab/filter indicator), `next-themes` toggle                                                                                                  | ✅ present (see DESIGN.md)                                                                                                                                                         |
| Motion: "Pause animations" control (`data-motion="paused"` on `<html>`, WCAG 2.2.2), reduced-motion support                                                                                                                                                                                                                 | ✅ present                                                                                                                                                                         |
| Three.js constellation background (lazy, idle-loaded, 30 fps, stops on reduced motion, paused animations, and hidden tabs)                                                                                                                                                                                                  | ✅ present                                                                                                                                                                         |
| SEO: metadata + canonicals with default OG/Twitter image on every page, `sitemap.ts` (with `lastModified`), `robots.ts`, `manifest.ts` (SVG + PNG + maskable icons), `favicon.ico`, `apple-icon.png`, OG images (site + per project, per-project alt), JSON-LD (Person, WebSite, ProfilePage, CreativeWork, BreadcrumbList) | ✅ present                                                                                                                                                                         |
| Tech logos: one cached sprite (`app/tech-sprite.svg/route.ts`) referenced with `<use>`                                                                                                                                                                                                                                      | ✅ present                                                                                                                                                                         |
| Contact form                                                                                                                                                                                                                                                                                                                | ⚠️ composes a `mailto:` (works without JS), never claims success, and offers Gmail/Outlook compose links and Copy email; a Server Action + `Message` model is planned              |
| CSP                                                                                                                                                                                                                                                                                                                         | ⚠️ static policy in `next.config.ts`, shipped as `Content-Security-Policy-Report-Only`; switch to enforcing (and add `upgrade-insecure-requests`) once production shows no reports |
| Auth.js sign-in (credentials, one Admin role), server-side sessions (12 h / 60 min idle, revocable), argon2id, DB rate limit, seeded default admin                                                                                                                                                                          | ✅ present (§4)                                                                                                                                                                    |
| Admin console: dashboard, users (add, edit, disable, delete, set password), account (change password, sessions), audit log; sidebar (collapse toggle on top, account menu at the bottom, mobile drawer), reusable UI system, tag-cached DAL                                                                                 | ✅ present (§4, §8, §14)                                                                                                                                                           |
| Admin modules Projects, Blogs, Professions, Categories, Settings                                                                                                                                                                                                                                                            | ⬜ "Coming soon" pages; follow the recipe in §14                                                                                                                                   |
| Email flows (verification, password reset), OAuth, 2FA, impersonation                                                                                                                                                                                                                                                       | ⬜ not planned for now                                                                                                                                                             |
| Blog and contact-message storage                                                                                                                                                                                                                                                                                            | ⬜ planned                                                                                                                                                                         |
| Vitest (`pnpm test`: dates, contact, JSON-LD, content integrity, admin schemas and helpers) and Playwright + axe tests (`pnpm test:e2e`: routes, a11y, `og:image`, redirects, admin sign-in and user management), both in CI                                                                                                | ✅ present                                                                                                                                                                         |
| Lighthouse CI budgets                                                                                                                                                                                                                                                                                                       | ⬜ planned                                                                                                                                                                         |
