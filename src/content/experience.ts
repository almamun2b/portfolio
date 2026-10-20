import type { Experience } from "@/lib/schemas/content";

// Newest first. Dates and bullets follow the resume.
export const experience = [
  {
    id: "xubitar",
    company: "Xubitar",
    companyUrl: "https://xubitar.com",
    role: "Full Stack Engineer",
    start: "2026-07",
    summary:
      "Building production e-commerce systems: Shopify apps, multi-store order fulfilment, and inventory management.",
    highlights: [
      "Design, develop, and maintain production e-commerce web applications with React, Next.js, Node.js, Express, Prisma, and PostgreSQL.",
      "Build Shopify apps on the Admin API, Storefront API, and webhooks, from admin UI to storefront extensions.",
      "Build inventory management: stock tracking, low-stock alerts, purchase and sales flows, and reporting.",
      "Build backend services and REST APIs with a focus on performance, security, and maintainability.",
      "Own maintenance, bug fixes, and performance work on live e-commerce applications.",
      "Ship responsive, accessible, high-performance interfaces with current React and Next.js practice.",
    ],
    stack: [
      "nextjs",
      "react",
      "typescript",
      "nodejs",
      "express",
      "prisma",
      "postgresql",
      "shopify",
    ],
  },
  {
    id: "devxhub",
    company: "Devxhub (Developer eXperience Hub)",
    companyUrl: "https://devxhub.com",
    role: "Software Engineer",
    start: "2022-03",
    end: "2026-02",
    summary:
      "Four years shipping client products with Nuxt, Next.js, React, and Vue: a social media archiving system, e-learning platforms, and e-commerce sites.",
    highlights: [
      "Designed, built, and maintained production web applications with Nuxt.js, Next.js, React, Vue, and TypeScript.",
      "Delivered user-facing features across a social media archiving system, learning management systems, and e-commerce platforms.",
      "Integrated REST APIs with the backend team: contracts, auth, error handling, and data fetching.",
      "Implemented state management with Redux, Pinia, and Vuex.",
      "Built reusable components and kept UI consistent across products with Tailwind CSS and Vuetify.",
      "Built responsive, accessible, SEO-friendly interfaces with attention to Core Web Vitals and rendering performance.",
      "Improved performance and code quality through refactoring and modern JavaScript practice.",
      "Worked in Agile teams: stand-ups, sprint planning, and peer code review.",
    ],
    stack: [
      "nuxt",
      "vue",
      "nextjs",
      "react",
      "typescript",
      "tailwind",
      "pinia",
      "redux",
    ],
  },
] satisfies Experience[];
