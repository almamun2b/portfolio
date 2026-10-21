// Plain constants about content, with no zod, so Client Components can
// import them without pulling the schema library into the browser bundle
// (audit #6). schemas/content.ts builds its enums from these.

export const PROJECT_CATEGORIES = [
  "fullstack",
  "shopify",
  "automation",
  "frontend",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_CONTEXTS = [
  "personal",
  "xubitar",
  "devxhub",
  "client",
] as const;
export type ProjectContext = (typeof PROJECT_CONTEXTS)[number];

export const PROJECT_CONTRIBUTIONS = [
  "owner",
  "lead",
  "co-builder",
  "contributor",
] as const;
export type ProjectContribution = (typeof PROJECT_CONTRIBUTIONS)[number];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  fullstack: "Full-stack",
  shopify: "Shopify & e-commerce",
  automation: "Automation & data",
  frontend: "Frontend",
};

export const CONTEXT_LABELS: Record<ProjectContext, string> = {
  personal: "Personal project",
  xubitar: "Built at Xubitar",
  devxhub: "Built at Devxhub",
  client: "Client project",
};

export const CONTRIBUTION_LABELS: Record<ProjectContribution, string> = {
  owner: "Sole developer",
  lead: "Lead developer",
  "co-builder": "Co-builder",
  contributor: "Contributor",
};
