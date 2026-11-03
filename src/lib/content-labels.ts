// Plain constants about content, with no zod, so Client Components can
// import them without pulling the schema library into the browser bundle
// (audit #6). schemas/content.ts builds its enums from these.

export const PROJECT_CATEGORIES = [
  "fullstack",
  "shopify",
  "automation",
  "frontend",
] as const;
// The seed categories. Categories are rows in the database now (edited in
// /admin/categories), so a category slug is any string; these constants only
// seed the table and label the original four in tests.
export type SeedCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectCategory = string;

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

export const CATEGORY_LABELS: Record<SeedCategory, string> = {
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

/** Designed covers shown when a project has no screenshot. */
export const COVER_ARTS = [
  "terminal",
  "dashboard",
  "inbox",
  "editor",
  "timeline",
  "course",
] as const;

export const COVER_ART_LABELS: Record<(typeof COVER_ARTS)[number], string> = {
  terminal: "Terminal",
  dashboard: "Dashboard",
  inbox: "Inbox",
  editor: "Editor",
  timeline: "Timeline",
  course: "Course",
};
