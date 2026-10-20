import type { ProcessStep, Service, SkillGroup } from "@/lib/schemas/content";

export const services = [
  {
    id: "fullstack",
    title: "Full-stack product engineering",
    tagline: "From schema to screen",
    description:
      "I take a feature from data model to shipped UI: Prisma schema and migrations, REST endpoints or Server Actions, auth and roles, and the React interface on top, with one person accountable for the whole path.",
    stack: ["nextjs", "react", "nodejs", "prisma", "postgresql"],
  },
  {
    id: "frontend",
    title: "Frontend engineering",
    tagline: "Fast, accessible interfaces",
    description:
      "Interfaces in React, Next.js, Vue, and Nuxt with Tailwind CSS: responsive, keyboard-accessible, and built for Core Web Vitals.",
    stack: ["react", "nextjs", "vue", "nuxt", "tailwind"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    tagline: "Services that stay up",
    description:
      "Node.js and Express services, REST APIs, background workers, and job queues on PostgreSQL or MongoDB, with validation and error handling designed in.",
    stack: ["nodejs", "express", "postgresql", "mongodb", "zod"],
  },
  {
    id: "shopify",
    title: "Shopify & e-commerce",
    tagline: "Apps stores run on",
    description:
      "Shopify apps on the Admin and Storefront APIs, webhooks, discount Functions, and theme extensions, plus the inventory and fulfilment systems behind a store.",
    stack: ["shopify", "graphql", "webhooks", "webassembly"],
  },
  {
    id: "integrations",
    title: "Integrations & automation",
    tagline: "Systems that talk to each other",
    description:
      "Supplier feeds, carrier tracking, email providers, and crawlers, built with rate limits, retries, and idempotent processing so they keep running unattended.",
    stack: ["rest", "webhooks", "playwright", "email"],
  },
  {
    id: "performance",
    title: "Performance & code health",
    tagline: "Maintainable at scale",
    description:
      "Profiling, code splitting, caching, and refactoring legacy code into modules a team can own, with strict TypeScript, linting, and code review.",
    stack: ["typescript", "eslint", "vite"],
  },
] satisfies Service[];

export const skillGroups = [
  {
    id: "frontend",
    label: "Frontend",
    description: "What users see and touch.",
    items: [
      { name: "React", tech: "react" },
      { name: "Next.js", tech: "nextjs" },
      { name: "Vue.js", tech: "vue" },
      { name: "Nuxt", tech: "nuxt" },
      { name: "Astro", tech: "astro" },
      { name: "Tailwind CSS", tech: "tailwind" },
      { name: "shadcn/ui", tech: "shadcn" },
      { name: "Vuetify", tech: "vuetify" },
      { name: "HTML5", tech: "html" },
      { name: "CSS", tech: "css" },
    ],
  },
  {
    id: "state",
    label: "State & data fetching",
    description: "Keeping client state predictable.",
    items: [
      { name: "Redux Toolkit", tech: "redux" },
      { name: "RTK Query", tech: "rtk-query" },
      { name: "TanStack Query", tech: "tanstack-query" },
      { name: "Zustand", tech: "zustand" },
      { name: "Pinia", tech: "pinia" },
      { name: "Vuex", tech: "vue" },
      { name: "React Hook Form", tech: "react-hook-form" },
      { name: "Zod", tech: "zod" },
    ],
  },
  {
    id: "backend",
    label: "Backend & databases",
    description: "Services, storage, and integrations.",
    items: [
      { name: "Node.js", tech: "nodejs" },
      { name: "Express", tech: "express" },
      { name: "REST APIs", tech: "rest" },
      { name: "Prisma", tech: "prisma" },
      { name: "PostgreSQL", tech: "postgresql" },
      { name: "MongoDB (Mongoose)", tech: "mongodb" },
      { name: "MySQL", tech: "mysql" },
      { name: "Redis", tech: "redis" },
      { name: "Auth.js / JWT", tech: "auth" },
      { name: "Webhooks", tech: "webhooks" },
    ],
  },
  {
    id: "commerce",
    label: "Shopify & e-commerce",
    description: "Apps and systems behind online stores.",
    items: [
      { name: "Shopify Admin API", tech: "shopify" },
      { name: "Storefront API", tech: "shopify" },
      { name: "Shopify Functions", tech: "webassembly" },
      { name: "Theme app extensions", tech: "shopify" },
      { name: "GraphQL", tech: "graphql" },
      { name: "Inventory & fulfilment", tech: "rest" },
    ],
  },
  {
    id: "tooling",
    label: "Languages & tooling",
    description: "How the work gets built and shipped.",
    items: [
      { name: "TypeScript", tech: "typescript" },
      { name: "JavaScript (ES6+)", tech: "javascript" },
      { name: "Git & GitHub", tech: "github" },
      { name: "Vite", tech: "vite" },
      { name: "Docker", tech: "docker" },
      { name: "PM2", tech: "pm2" },
      { name: "Playwright", tech: "playwright" },
      { name: "ESLint & Prettier", tech: "eslint" },
    ],
  },
  {
    id: "practices",
    label: "Practices",
    description: "How I work with a team.",
    items: [
      { name: "Agile / Scrum" },
      { name: "Code review" },
      { name: "SSR & SEO", tech: "nextjs" },
      { name: "Internationalisation", tech: "i18n" },
      { name: "Accessibility (WCAG)" },
      { name: "Performance optimisation" },
      { name: "AI-assisted development", tech: "openai" },
    ],
  },
] satisfies SkillGroup[];

export const processSteps = [
  {
    title: "Understand",
    description:
      "Who uses it, what has to be true on launch day, and what can wait. I ask until the edge cases are written down.",
    output: "Scope & data model",
  },
  {
    title: "Design the system",
    description:
      "Schema, API contracts, and the screens, agreed before code, so frontend and backend can move in parallel.",
    output: "Schema, contracts, UI plan",
  },
  {
    title: "Build & test",
    description:
      "Small, reviewable changes behind typed boundaries, checked in the browser on desktop and mobile, not only in CI.",
    output: "Working increments",
  },
  {
    title: "Ship & maintain",
    description:
      "Deploy, watch the logs, fix what real users find, and keep the codebase easy for the next person to change.",
    output: "Production & handover",
  },
] satisfies ProcessStep[];
