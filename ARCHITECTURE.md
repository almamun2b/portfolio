# Architecture

This is the blueprint for a production-grade full-stack template: **Next.js 16 (App Router) + React 19.3 + Prisma 7 (PostgreSQL)** with authentication, user management, SEO, accessibility, performance, and security built in.

Companion docs: [DESIGN.md](DESIGN.md) is the design system (tokens, theming, typography, component conventions); [AGENTS.md](AGENTS.md) holds the day-to-day rules for coding agents; [README.md](README.md) is the human quick start.

The repository started from the `create-prisma` Next.js scaffold. Much of what follows is the **target** design. Check the [Implementation status](#implementation-status) table before you assume a file or feature exists, and update the table in the same change that implements something.

---

## 1. Stack and decisions

| Concern    | Choice                                                                                                                                                                                                       | Why                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 16 App Router, Turbopack, `output: "standalone"`                                                                                                                                                     | RSC by default, Server Actions, file-based metadata (robots/sitemap/OG). Standalone output is needed for container and Prisma Compute deploys.                              |
| Language   | TypeScript `strict`                                                                                                                                                                                          | —                                                                                                                                                                           |
| Database   | PostgreSQL: a local server in development, a hosted database (for example Prisma Postgres) in production                                                                                                     | —                                                                                                                                                                           |
| ORM        | Prisma 7 with the `prisma-client` generator and the `@prisma/adapter-pg` driver adapter                                                                                                                      | Prisma 7 requires a driver adapter. The client is generated into `src/generated/prisma`.                                                                                    |
| Auth       | **Auth.js v5** (`next-auth@5.0.0-beta.32`, exact pin), Credentials provider, JWT cookie backed by a `Session` table, argon2id (`@node-rs/argon2`)                                                            | One admin role and sign-in only, so no OAuth, sign-up, or adapter: we own the `User` and `Session` tables, which lets sessions be revoked server-side. Details in §4.       |
| Validation | **Zod**                                                                                                                                                                                                      | One schema per input, shared by the Server Action and the Route Handler that receive it. Also validates env vars.                                                           |
| UI         | Tailwind CSS v4, hand-built primitives in `src/components/ui` (no shadcn/Radix, owner's decision), `cva`, `cn`, `lucide-react` (UI glyphs), `simple-icons` (tech logos), `next-themes`, `three` (background) | Native `<dialog>`/`<details>` give focus management and keyboard behaviour without a component library. Tokens and conventions: [DESIGN.md](DESIGN.md).                     |
| Forms      | Native `<form action>` + `useActionState` (`ActionForm`) over Server Actions                                                                                                                                 | Works without JS and ships no validation library: the server's Zod messages are the one voice, shown inline (`aria-invalid`, `aria-describedby`, focus on the first error). |
| API        | Route Handlers under `/api/*`, built with `apiRoute()` over the same module services                                                                                                                         | For external clients; the UI never calls it (Server Components and actions use the services in-process).                                                                    |
| Caching    | **Cache Components**: `"use cache"` + `cacheTag` + `cacheLife`; `updateTag` / `revalidateTag`                                                                                                                | Reads are fetched once and expire only when a related mutation says so. See "Admin caching".                                                                                |
| Email      | `src/server/email` adapter (console transport in dev, provider in prod)                                                                                                                                      | Needed for verification and reset flows.                                                                                                                                    |
| Testing    | Vitest (unit/integration), Playwright + `@axe-core/playwright` (e2e + a11y), Lighthouse CI (perf/SEO/a11y budgets)                                                                                           | —                                                                                                                                                                           |
| Deploy     | Vercel (production: `portfolio-mamun.vercel.app`); the standalone build also runs on any Node host or Prisma Compute (`prisma.compute.ts`)                                                                   | —                                                                                                                                                                           |

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
  env.ts                Zod-validated env; the ONLY place that reads process.env (env-node.ts = same, plus .env loading, for tools outside Next)
  app/
    layout.tsx          <html lang>, root metadata, providers
    (site)/             Public, indexable pages (home, about, projects, contact, legal)
    admin/              Private console, noindex (layout.tsx mounts the toaster)
      (auth)/sign-in/     Sign-in page (no shell)
      (dashboard)/        Signed-in shell: layout.tsx (static frame skeleton; DashboardShell streams in) and one folder per module
        users/ audit-log/ account/        Built modules
        projects/ blogs/ professions/ categories/ settings/   "Coming soon" placeholders
    api/                JSON API: route.ts files only re-export module controllers (auth/[...nextauth] is Auth.js)
      health/ users/ sessions/ audit-logs/ account/
    robots.ts  sitemap.ts  manifest.ts  opengraph-image.tsx  icon.svg
    not-found.tsx  error.tsx
  components/
    ui/                 Hand-built primitives (button, dialog/sheet, table, data-table, pagination, dropdown, toast, ...)
    forms/              ActionForm (useActionState + Server Action), form fields, submit button, useConfirmAction
    admin/              AdminFrame (sidebar, drawer, top bar), nav-config registry, ComingSoon, skeletons, ErrorState
    …                   public-site components
  lib/                  Isomorphic helpers: schemas (Zod), DTO types, url-state, format, auth policy constants
  server/               Server-only code (`import "server-only"`); only *.actions.ts files carry "use server"
    core/               Shared infrastructure, no business rules
      db.ts               PrismaClient singleton (created on first query)
      errors/             AppError (the one error class), codes, Prisma/Zod mappers, normalizeError()
      query-builder.ts    QueryBuilder: search / filter / range / sort / paginate over any Prisma delegate
      cache.ts            CACHE_TAGS; updateTags (actions), expireTags (routes), refreshTags (background)
      action.ts           adminAction() / publicAction(): the Server Action wrapper
      http/               apiRoute() controller wrapper and the response envelope
      audit.ts  defer.ts  logger.ts  password.ts  rate-limit.ts  request-context.ts
    modules/            One folder per domain (MVC)
      <name>/             <name>.model.ts      Prisma select + row -> DTO
                          <name>.service.ts    rules, authorization, audit, cached reads
                          <name>.controller.ts HTTP: apiRoute(...) handlers
                          <name>.actions.ts    UI: "use server", adminAction(...)
                          <name>.constants.ts  searchable fields, mutation tag map
      auth/ users/ sessions/ account/ audit/ dashboard/ health/ content/
  generated/prisma/     Prisma client output (gitignored, never edit)
tests/
  unit/  e2e/
```

Route groups `(site)`, `(auth)`, `(dashboard)` do not appear in URLs. Each group has its own `layout.tsx`, so indexing, shell UI, and auth requirements are set once per group.

---

## 3. Request lifecycle and layering

```
                       ┌─ RSC page ────────────────────┐
Browser ──► proxy.ts ──┼─ Server Action (*.actions.ts) ┼─► modules/<x>/<x>.service.ts ─► <x>.model.ts ─► core/db.ts ─► Postgres
                       └─ Route Handler (*.controller) ┘     authorization, invariants,     select + DTO
                                                             audit, "use cache" reads
```

Rules that hold across the codebase:

1. **Only `src/server/core/**` and module services/models import `db`.** Pages, actions, and controllers call service functions. ESLint (`no-restricted-imports`) enforces it. The service is where authorization happens.
2. **`proxy.ts` is not a security boundary.** It only does cheap cookie-presence redirects for UX. Every service function, Server Action, and Route Handler checks the session again. This follows Next's own guidance; a proxy/middleware bypass (for example CVE-2025-29927) must not expose data.
3. **Server Actions are public HTTP endpoints.** Each one goes through `adminAction()` / `publicAction()` (`src/server/core/action.ts`): (a) authenticate, (b) parse input with Zod, (c) run the service, (d) `updateTag` the mutation's tags, (e) log with a request id, and (f) return a typed `ActionResult`; it never throws raw errors to the client.
4. **Route Handlers are public endpoints too.** `apiRoute()` (`src/server/core/http/route.ts`) does the same steps for HTTP: 401/404 for no session or no admin role, a same-origin check on writes, Zod for params, query, and body, `revalidateTag(tag, { expire: 0 })` for the mutation's tags, and the JSON envelope.
5. **One error class.** Expected failures throw `AppError(status, message, code, fieldErrors?)`. `normalizeError()` turns `AppError`, Zod, and Prisma errors (P2002 → 409, P2025 → 404, P2003 → 400, P10xx → 503) into one shape for both doors, and hides anything else behind a reference id.
6. **DTOs, not models.** A model file owns each `select` and returns plain objects with only the fields the caller needs. `passwordHash`, tokens, and similar fields never cross into a Client Component or an API response. `"use server"` goes only on `*.actions.ts` files: every export of such a file is a public endpoint, so it must never be put on a service or helper.
7. **No self-fetch.** Server Components and actions call services directly. Fetching this app's own `/api` from the server costs an extra HTTP hop on every cache miss and fails at build time. (`fetch(url, { next: { tags } })` is for HTTP backends outside this app and invalidates through the same tags.)
8. **Env access goes through `src/env.ts`.** Only variables prefixed with `NEXT_PUBLIC_` reach the client, and each one needs a stated reason.

### HTTP API

Same services, same validation, same cache tags as the UI. Responses use the Express starter's envelope: `{ success, statusCode, message, data, meta?, path, timestamp }`; errors are `{ success: false, statusCode, code, message, errors: [{ field, message }], requestId, path, timestamp }`. Lists take `?page&limit&searchTerm&sortBy&sortOrder` plus filters and return `meta: { page, limit, total, totalPage }`. Bad list params fall back to defaults instead of failing. Authentication is the session cookie (sign in through Auth.js); there is no token API yet.

| Method             | Path                       | Does                                                       |
| ------------------ | -------------------------- | ---------------------------------------------------------- |
| GET                | `/api/health`              | Liveness plus a database round trip (public, never cached) |
| GET, POST          | `/api/users`               | List (`status` filter) / create                            |
| GET, PATCH, DELETE | `/api/users/[id]`          | Read / update name and email / delete                      |
| PATCH              | `/api/users/[id]/status`   | Enable or disable (signs the user out)                     |
| PUT                | `/api/users/[id]/password` | Set another user's password (signs them out)               |
| GET, DELETE        | `/api/users/[id]/sessions` | List active sessions / revoke all                          |
| DELETE             | `/api/sessions/[id]`       | Revoke one session                                         |
| GET                | `/api/audit-logs`          | List (`area` filter)                                       |
| PUT                | `/api/account/password`    | Change your own password                                   |
| GET, POST          | `/api/auth/[...nextauth]`  | Auth.js (sign-in, session, sign-out)                       |

Details: `node_modules/next/dist/docs/01-app/02-guides/data-security.md` and `…/authentication.md`.

---

## 4. Authentication and user management

**As built.** Sign-in only, one role (**Admin**), no sign-up. The default admin is created by `pnpm db:seed` from `SEED_ADMIN_*`.

**Library:** Auth.js v5 (`next-auth@5.0.0-beta.32`, exact pin; read the changelog before bumping), configured in `src/server/modules/auth/auth.config.ts` and mounted at `src/app/api/auth/[...nextauth]/route.ts`. Server code reads the session through `getSession()` / `getAdmin()` / `requireAdmin()` in `src/server/modules/auth/auth.guard.ts`; the sign-in form calls the `signInAction` Server Action. No `SessionProvider`, no client-side session fetch. The sign-in page is prerendered, form included (it works without JS); only the hidden `?next=` field (`useSearchParams`) and the redirect for an already signed-in admin depend on the request.

**Sessions:** `session.strategy: "jwt"` (the Credentials provider requires it), used as a pointer to a server-side `Session` row. On sign-in the `jwt` callback creates the row (random 32-byte token; only its SHA-256 is stored) and puts the raw token in the encrypted cookie. On every later request it validates the row: **revoked**, **expired** (12 h absolute), **idle** (60 min since `lastSeenAt`, written at most every 5 min), or **user disabled/missing** all end the session. Pure rules live in `src/lib/auth/session-policy.ts` (unit tested). Cookies keep the Auth.js defaults: `HttpOnly`, `SameSite=Lax`, `Secure` and the `__Secure-` prefix over https.

**Sign-in hardening** (`src/server/modules/auth/auth.service.ts`):

- Generic "Email or password is incorrect." for every failure (unknown email, wrong password, disabled account), with a dummy argon2 verify for unknown emails so timing doesn't reveal which exist.
- DB-backed rate limit (`RateLimit`, atomic upsert): 5 attempts per 15 min per IP + email, 30 per IP. It guards the raw `/api/auth` endpoint as well as the form, which shows a friendlier message from a read-only pre-check.
- Every success, failure, and block is written to `AuditLog` with the real reason (never shown to the user).
- `next` after sign-in is validated by `safeAdminPath()` (only `/admin/...`), so it can't be an open redirect.

**Authorization:** `User.role` is the `Role` enum (`ADMIN`). The session row (revoked, expired, idle, user disabled) is checked on every request, and `getAdmin()` reads the user's role and status through a `"use cache"` read tagged `user:<id>`, which every status, password, and delete mutation expires, so disabling or deleting a user takes effect on their next request. `requireAdmin()` redirects to `/admin/sign-in` with no session and `notFound()`s a session without the admin role. Service writes call `assertAdmin()`, which throws an `AppError` that the action or route wrapper turns into a result. `src/proxy.ts` is a UX-only redirect (cookie present or not), never the security check.

**User management (`/admin/users`):** a server-rendered table with URL-driven search, status filter, sorting, and pagination; create and edit in a drawer; row menu with view, edit, set password, disable or enable, and delete (typed-email confirmation). Guards in the service: you can't disable or delete yourself, the last active admin can't be disabled or deleted, emails are unique (case-insensitive `citext`). Disabling or setting a password revokes all of that user's sessions. **Account (`/admin/account`):** change your own password (current password required, show/hide inputs, other sessions are signed out) and list or revoke your sessions. **User detail** shows profile, active sessions, and recent audit entries. **Audit log (`/admin/audit-log`)** is read-only, searchable, and filterable.

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
- Every mutation has **pending**, **success**, and **error** states: `ActionForm` (`useActionState`) for forms, `useConfirmAction` for confirm dialogs, and toasts announced through an `aria-live` region.
- Every async route segment has `loading.tsx` with skeletons that match final layout dimensions (no CLS), and `error.tsx` with a retry button. Independent widgets (dashboard stats, recent activity) stream behind their own `<Suspense>` and a `catchError` boundary. The first server render shows no loader; dimming and spinners appear only while navigating or mutating.
- Dialogs, drawers, and confirmations are built on the native modal `<dialog>`; menus on the native Popover API (`Dropdown`). Reuse these; do not add a second implementation or hand-roll focus traps.
- Destructive actions need a confirmation dialog. Account and user deletion additionally require typing a confirmation phrase.
- Tables (admin users): URL-driven state (`?searchTerm=&page=&limit=&sortBy=&sortOrder=`; rows per page is a dropdown) so views are shareable and work with back/forward.
- Motion: CSS transitions and View Transitions where they help; always respect `prefers-reduced-motion`.
- Theming: CSS variables with light and dark via `prefers-color-scheme` plus a user override, and no flash of the wrong theme. The default palette is blue-primary and contrast-checked in both themes; adopters re-brand it by swapping tokens. Token names, values, and usage rules are in [DESIGN.md](DESIGN.md).

---

## 8. Performance and speed

Targets (p75, mobile): **LCP < 2.5 s, INP < 200 ms, CLS < 0.1**, and Lighthouse ≥ 95 for Performance, SEO, Accessibility, and Best Practices on marketing pages. Enforced by Lighthouse CI budgets.

- **Rendering:** public pages are prerendered (Cache Components; the date-dependent bits come from `"use cache"` helpers with `cacheLife("days")`). Admin pages have a prerendered shell (frame skeleton) and stream the session-dependent frame and page; their **data** is cached with tags, see "Admin caching" below. Never use a blanket `revalidatePath("/")`.
- **Data:** avoid N+1 (use `include`/`select`, or batch). Always `select` only the needed columns. Paginate admin lists and back them with DB indexes (`@@index` on `email`, `createdAt`, `role`). Run independent queries in parallel with `Promise.all`.
- **Assets:** `next/image` with explicit `sizes` and `priority` only on the LCP image. `next/font` (self-hosted, `display: swap`). `next/script` with `strategy="lazyOnload"` for third parties.
- **JS budget:** keep client components small; `dynamic()` import heavy client-only widgets; check `@next/bundle-analyzer` output for regressions.
- **Cache Components and Partial Prefetching are on** (`cacheComponents`, `partialPrefetching`). Enable `reactCompiler` (needs `babel-plugin-react-compiler`) once there are enough client components.
- **DB connections:** a single `PrismaClient` per process (`globalThis` singleton in dev to survive HMR). Use a pooled connection string in serverless environments.

---

### Admin caching

Reads use Cache Components: `"use cache"` + `cacheTag()` + `cacheLife("admin")` (a profile in `next.config.ts`; tags drive freshness, the timers are a safety net).

- **Reads:** a service function first authorizes (`requireAdmin()`, outside the cache, because cached scopes can't read cookies), then calls a private `"use cache"` function with plain, serializable arguments. Next builds the cache key from those arguments, so every caller (page, action, API) shares one entry until a mutation expires its tag. Nothing is fetched twice for the same input.
- **Tags:** `CACHE_TAGS` in `src/server/core/cache.ts`: `users`, `user:<id>`, `sessions:<userId>`, `audit`, `dashboard`.
- **Which tags a mutation expires** is declared once per module (`userTags`, `sessionTags`, `accountTags` in `*.constants.ts`) and applied by the wrapper, so the action and the route for the same mutation can't drift:
  - Server Action → `updateTag()` (read-your-own-writes: the next render waits for fresh data; Server Actions only);
  - Route Handler → `revalidateTag(tag, { expire: 0 })` (the same "no stale data" result where `updateTag` isn't allowed);
  - background effects nobody waits on (last sign-in time) → `revalidateTag(tag, "max")` (stale-while-revalidate).
    `tests/unit/mutation-tags.test.ts` fails when an action or route is added without `tags`.
- **Per request:** `getSession` / `getAdmin` use React `cache()`, so the layout, the page, and the service share one lookup.
- **DTOs** carry dates as ISO strings, because cached values are serialized.

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

- Authorization lives in the services (§3). Every admin endpoint re-checks the role server-side.
- Rate limiting on auth endpoints and expensive Server Actions (`src/server/core/rate-limit.ts`, DB-backed; Auth.js has none built in).
- CSRF: `apiRoute()` rejects cross-site writes (`Origin` / `Sec-Fetch-Site`). Server Actions check the `Origin` header (configure `serverActions.allowedOrigins` behind proxies). Auth.js protects its own endpoints with a double-submit CSRF token and trusts only the configured host (set `AUTH_TRUST_HOST=true` behind a reverse proxy). Never mutate on `GET`.
- Auth.js does not store passwords. We hash them with argon2id (`@node-rs/argon2`) in `src/server/core/password.ts`. Enforce a minimum length of 12. Check against breached-password lists.
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
2. **Zod schemas:** `src/lib/schemas/<domain>.ts`: the create/update inputs (shared by the action and the route; export a body-only schema for the API and extend it with confirmations for the form) and a list-params schema with `.catch()` defaults (`listBase`, `sortByParam`, `sortOrder` from `schemas/common.ts`). DTO types go in `src/lib/dto.ts` (dates as ISO strings, no secrets).
3. **Module:** `src/server/modules/<domain>/` with `<domain>.model.ts` (explicit `select` + DTO mapper), `<domain>.constants.ts` (searchable fields and the mutation tag map, `satisfies MutationTags`), and `<domain>.service.ts`. Reads: `await requireAdmin()`, then a private `"use cache"` function with `cacheTag` / `cacheLife("admin")` that builds the query with `QueryBuilder`. Writes: `assertAdmin()`, check invariants (throw `AppError`), change + `writeAudit(..., tx)` in one `$transaction`. Add the module's tags to `CACHE_TAGS` in `src/server/core/cache.ts`.
4. **Actions and controllers:** `<domain>.actions.ts` (`"use server"`; each action is `adminAction(name, schema, handler, { tags })`) and `<domain>.controller.ts` (`apiRoute({ name, auth: "admin", params, query, body, tags }, handler)`), plus `src/app/api/<domain>/route.ts` files that only re-export the controllers. Nothing else belongs in these files.
5. **Routes:** `src/app/admin/(dashboard)/<domain>/` with `page.tsx` (parse `searchParams` with the schema via `firstOf`, call the service, wrap the toolbar and table in `ListRegion` / `ListBody`), `loading.tsx` (skeleton of the same shape), `error.tsx` (`ErrorState`), and private `_components/` (tables use `DataTable` + `Pagination`; forms use `ActionForm`; overlays use `Drawer`, `Dialog`, `ConfirmDialog`).
6. **Navigation:** one entry in `src/components/admin/nav-config.ts` (`status: "ready"`). It feeds the sidebar, the dashboard's module cards, and the breadcrumbs.
7. **Tests and docs:** unit tests for the schemas, an e2e path for the main flow, and a row in the status table below.

Rules that stay the same for every module: Server Components first; all data through services (Server Components and actions call them in-process; no client `fetch`; the `/api` routes are for external clients); every action and route authenticated, authorized, validated, logged, and tagged; actions return `ActionResult`; mutations audited; list state in the URL; empty, loading, and error states present.

---

## Implementation status

The public portfolio is built and fully static. The admin console (§4, §14) is built on top of it. Contact messages, the blog, and the content modules remain planned.

| Area                                                                                                                                                                                                                                                                                                                        | Status                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio routes: `/`, `/about`, `/projects` (URL filter `?category=`), `/projects/[slug]` (SSG via `generateStaticParams`; an unknown slug 404s through `notFound()`), `/contact`, `/privacy-policy`, `/terms-and-conditions`, 404                                                                                         | ✅ present, all prerendered (○); the date-dependent figures come from `"use cache"` helpers (`cacheLife("days")`)                                                                  |
| Redirects from the previous site's URLs and pre-launch slug renames (`next.config.ts` › `legacyRedirects`)                                                                                                                                                                                                                  | ✅ present, covered by an e2e test                                                                                                                                                 |
| Content layer: `src/content/*` + zod schemas (`src/lib/schemas/content.ts`) + service getters (`src/server/modules/content/*.service.ts`); zod-free label constants in `src/lib/content-labels.ts` for Client Components                                                                                                    | ✅ present                                                                                                                                                                         |
| Project screenshots: `scripts/capture-screenshots.ts` (Playwright; live URLs or `slug=url` overrides for local servers) + `project-media.{generated,manual}.ts`                                                                                                                                                             | ✅ present                                                                                                                                                                         |
| `@/*` path alias → `./src/*`                                                                                                                                                                                                                                                                                                | ✅ done                                                                                                                                                                            |
| `src/env.ts`                                                                                                                                                                                                                                                                                                                | ✅ `DATABASE_URL` and `AUTH_SECRET` optional at build, `AUTH_TRUST_HOST`, `NEXT_PUBLIC_SITE_URL` with default                                                                      |
| `src/server/core/db.ts` Prisma client                                                                                                                                                                                                                                                                                       | ✅ present; created on first query, so the public site builds without a database                                                                                                   |
| Tailwind v4 tokens (dark default + light; swappable palettes saved in `src/styles/color-systems/`, active violet → indigo, contrast-tested), hand-built UI primitives (sliding tab/filter indicator), `next-themes` toggle                                                                                                  | ✅ present (see DESIGN.md)                                                                                                                                                         |
| Motion: "Pause animations" control (`data-motion="paused"` on `<html>`, WCAG 2.2.2), reduced-motion support                                                                                                                                                                                                                 | ✅ present                                                                                                                                                                         |
| Three.js constellation background (lazy, idle-loaded, 30 fps, stops on reduced motion, paused animations, and hidden tabs)                                                                                                                                                                                                  | ✅ present                                                                                                                                                                         |
| SEO: metadata + canonicals with default OG/Twitter image on every page, `sitemap.ts` (with `lastModified`), `robots.ts`, `manifest.ts` (SVG + PNG + maskable icons), `favicon.ico`, `apple-icon.png`, OG images (site + per project, per-project alt), JSON-LD (Person, WebSite, ProfilePage, CreativeWork, BreadcrumbList) | ✅ present                                                                                                                                                                         |
| Tech logos: one cached sprite (`app/tech-sprite.svg/route.ts`) referenced with `<use>`                                                                                                                                                                                                                                      | ✅ present                                                                                                                                                                         |
| Contact form                                                                                                                                                                                                                                                                                                                | ⚠️ composes a `mailto:` (works without JS), never claims success, and offers Gmail/Outlook compose links and Copy email; a Server Action + `Message` model is planned              |
| CSP                                                                                                                                                                                                                                                                                                                         | ⚠️ static policy in `next.config.ts`, shipped as `Content-Security-Policy-Report-Only`; switch to enforcing (and add `upgrade-insecure-requests`) once production shows no reports |
| Auth.js sign-in (credentials, one Admin role), server-side sessions (12 h / 60 min idle, revocable), argon2id, DB rate limit, seeded default admin                                                                                                                                                                          | ✅ present (§4)                                                                                                                                                                    |
| Admin console: dashboard (stats and recent activity stream independently), users (add, edit, disable, delete, set password), account (change password, sessions), audit log; sidebar (collapse, mobile drawer), reusable UI system (skeletons, rows-per-page dropdown, pending states), tag-cached services                 | ✅ present (§4, §8, §14)                                                                                                                                                           |
| Modular MVC backend: `src/server/core` (AppError + `normalizeError`, `QueryBuilder`, tag helpers, `adminAction`, `apiRoute`) and `src/server/modules/*` (model, service, controller, actions)                                                                                                                               | ✅ present (§2, §3)                                                                                                                                                                |
| JSON API under `/api` (health, users, sessions, audit logs, account password) with the same services, validation, and cache tags as the UI                                                                                                                                                                                  | ✅ present (§3 › HTTP API)                                                                                                                                                         |
| Cache Components (`cacheComponents`, `partialPrefetching`): tagged `"use cache"` reads; `updateTag` in actions, `revalidateTag` in routes                                                                                                                                                                                   | ✅ present (§8 › Admin caching)                                                                                                                                                    |
| Admin modules Projects, Blogs, Professions, Categories, Settings                                                                                                                                                                                                                                                            | ⬜ "Coming soon" pages; follow the recipe in §14                                                                                                                                   |
| Email flows (verification, password reset), OAuth, 2FA, impersonation                                                                                                                                                                                                                                                       | ⬜ not planned for now                                                                                                                                                             |
| Blog and contact-message storage                                                                                                                                                                                                                                                                                            | ⬜ planned                                                                                                                                                                         |
| Vitest (`pnpm test`: dates, contact, JSON-LD, content integrity, admin schemas and helpers, `QueryBuilder`, `normalizeError`, mutation tag maps) and Playwright + axe tests (`pnpm test:e2e`: routes, a11y, `og:image`, redirects, admin sign-in and user management, the JSON API), both in CI                             | ✅ present                                                                                                                                                                         |
| Lighthouse CI budgets                                                                                                                                                                                                                                                                                                       | ⬜ planned                                                                                                                                                                         |
