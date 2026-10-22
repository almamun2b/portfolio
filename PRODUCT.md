# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters and hiring managers** filling full-time roles, remote included. They arrive from a CV, LinkedIn, or GitHub link, skim for a minute or two, and decide whether Mamun is worth an interview. They need the current role, years of experience, stack, and proof of shipped work, then the CV or a way to reach him.
- **Clients looking for contract work.** Founders and agencies who need a full-stack engineer for a web app, a Shopify app, or an integration. They need to see comparable work, what he takes on, and how to start a conversation.

Both carry equal weight. The primary action for both is to get in touch (email, contact form) or download the CV.

## Product Purpose

The personal portfolio of **Md Abdul Mamun**, a Full-Stack Software Engineer at Xubitar with 4+ years of experience. It presents who he is, what he builds, and the work that proves it, and turns a visit into a conversation.

Success means a visitor understands his level and stack within the first viewport, finds a project close to what they need, and contacts him or takes the CV.

## Positioning

A frontend-strong full-stack engineer who ships production systems end to end: React, Next.js, Vue/Nuxt, Node.js, Express, PostgreSQL with Prisma, MongoDB, and Shopify apps (Admin API, Functions, theme extensions). The proof is real systems: multi-store fulfilment and inventory, Shopify apps, data pipelines and automation, and public full-stack apps anyone can open.

## Operating Context

- Visitors arrive from the resume PDF, LinkedIn (`linkedin.com/in/mamun-cse`), GitHub (`github.com/almamun2b`), or a direct link, often on a phone.
- The site is static today. A backend (Prisma/Postgres content store, admin CMS, stored contact messages, blog) is planned, so content goes through a data-access layer that can switch from files to the database without page changes.

## Capabilities and Constraints

- Routes: a one-page home (hero, stack, about, services, featured projects, experience, process, contact) plus `/about`, `/projects`, `/projects/[slug]` case studies, and `/contact`.
- Every project page shows screenshots. Public projects are captured from their live URLs. Xubitar work uses client-free mockups or designed covers.
- **Xubitar projects are anonymized:** no client names, product names, logos, or store URLs. His role on each is stated honestly (owner, co-builder, or contributor).
- The lead-generation system is described as a "B2B lead-enrichment pipeline". The platform it collects from is never named.
- No API calls at runtime yet. The contact form composes an email to `almamun2b@gmail.com`.
- Stack: Next.js 16 App Router, React 19, Tailwind CSS v4, hand-built UI primitives (no shadcn or Radix), Prisma 7 kept for the future backend.

## Brand Commitments

- Name: **Md Abdul Mamun** (short form "Mamun"). Title: **Full-Stack Software Engineer**.
- Voice: first person, plain and confident. Specific stacks, systems, and numbers that can be checked; no hype words.
- Visual identity: a two-colour palette with two-stop gradients on a near-black, **violet → indigo**, chosen by the owner on 2026-10-23 after trialling colour systems (every palette is saved in `src/styles/color-systems/`, the original **emerald → cyan** included), with glass panels, a constellation background, and a portrait in the hero. The layout vocabulary was inspired by a reference site, but its three-stop violet/purple/cyan gradients must not be copied; the owner's own two-stop violet → indigo is a deliberate, separate choice.

## Evidence on Hand

- Resume: `public/resume.pdf` (same file as `Resume_Software_Engineer_Md_Abdul_Mamun.pdf`).
- Experience: Xubitar, Full Stack Engineer, July 2026 to present. Devxhub (Developer eXperience Hub), Software Engineer, March 2022 to February 2026.
- Education: B.Sc. in Computer Science and Engineering, Begum Rokeya University, Rangpur, 2021. Languages: Bangla (native), English (professional working proficiency).
- Contact: almamun2b@gmail.com, +880 1610-088700 (also WhatsApp), Sirajganj, Bangladesh. GitHub `almamun2b`, LinkedIn `mamun-cse`, X `almamun2b`, Facebook `almamun2b`.
- Public projects with live sites: Travel Buddy, Digital Wallet, Now Health, Library Management System, Next.js starter template and Express + Prisma boilerplate, Preorder Manager, Team Hub, RemoteRecruit landing page. Devxhub work: an AI go-to-market platform, a social media archiving platform, an e-learning platform. Devxhub client work is anonymized like Xubitar work: no client or product names, and no links to the client's product.
- Portrait photos: `~/Desktop/workspace/files/mamun images/mamun/`.
- **No testimonials, client logos, awards, certifications, or blog posts exist.** Don't invent them. Don't use project, client, or satisfaction counts that can't be checked; derive any stat from the content itself.

## Product Principles

1. **Proof before claims.** Show the shipped system, screenshot, stack, and role. A claim with no project behind it doesn't ship.
2. **Fast to scan.** A recruiter gets role, years, stack, and the CV in the first viewport; a client finds comparable work in two clicks.
3. **Honest about scope.** Say "I owned", "I co-built", or "I contributed" exactly as the work happened, and keep confidential client work anonymous.
4. **Static now, backend-ready.** Content goes through one data-access layer per domain, so moving to a database changes one file, not the pages.
5. **Motion serves the work.** The animated background and hero are atmosphere; they never delay content or block reading.

## Accessibility & Inclusion

WCAG 2.2 AA on every page: keyboard operation, visible focus, 4.5:1 text contrast in both themes, labelled form fields with linked errors, `prefers-reduced-motion` honoured (background, orbit, and marquee stop), and layouts that work at 375px wide.
