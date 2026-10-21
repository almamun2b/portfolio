import { z } from "zod";
import {
  PROJECT_CATEGORIES,
  PROJECT_CONTEXTS,
  PROJECT_CONTRIBUTIONS,
} from "@/lib/content-labels";
import { TECH_IDS } from "../tech-ids";

// One schema per content domain. The static files in src/content are parsed
// with these in the DAL, and the same shapes become the Prisma models when
// the backend lands: dates are "YYYY-MM" strings and images are plain paths.

export const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");

export const techIdSchema = z.enum(TECH_IDS);

export const imageSchema = z.object({
  src: z.string().startsWith("/"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1),
});

export const socialSchema = z.object({
  id: z.enum(["github", "linkedin", "x", "facebook", "email"]),
  label: z.string(),
  handle: z.string(),
  href: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  role: z.string(),
  roles: z.array(z.string()).min(1),
  pitch: z.string(),
  about: z.array(z.string()).min(1),
  location: z.string(),
  timezone: z.string(),
  email: z.email(),
  phone: z.object({ display: z.string(), href: z.string() }),
  /** International number, digits only, for wa.me links. */
  whatsapp: z.string().regex(/^\d{8,15}$/),
  availability: z.object({
    open: z.boolean(),
    label: z.string(),
    detail: z.string(),
  }),
  careerStart: monthSchema,
  /** Headline technologies (profile card, OG image), in display order. */
  primaryStack: z.array(techIdSchema).min(1),
  /** Everything shipped with, in display order (orbit, marquee, JSON-LD). */
  stack: z.array(techIdSchema).min(1),
  resume: z.object({
    href: z.templateLiteral(["/", z.string(), ".pdf"]),
    fileName: z.string(),
  }),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  companyUrl: z.url().optional(),
  role: z.string(),
  start: monthSchema,
  end: monthSchema.optional(),
  location: z.string().optional(),
  summary: z.string(),
  highlights: z.array(z.string()).min(1),
  stack: z.array(techIdSchema),
});

export const educationSchema = z.object({
  degree: z.string(),
  school: z.string(),
  place: z.string(),
  start: z.string(),
  end: z.string(),
  note: z.string(),
});

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  stack: z.array(techIdSchema),
});

export const skillGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  items: z.array(z.object({ name: z.string(), tech: techIdSchema.optional() })),
});

export const processStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  output: z.string(),
});

export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const projectCategorySchema = z.enum(PROJECT_CATEGORIES);

export const coverArtSchema = z.enum([
  "terminal",
  "dashboard",
  "inbox",
  "editor",
  "timeline",
  "course",
]);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  tagline: z.string(),
  summary: z.string(),
  /** Where it was built. Work for an employer is anonymized (PRODUCT.md). */
  context: z.enum(PROJECT_CONTEXTS),
  contribution: z.enum(PROJECT_CONTRIBUTIONS),
  role: z.string(),
  year: z.string(),
  categories: z.array(projectCategorySchema).min(1),
  featured: z.boolean(),
  stack: z.array(techIdSchema).min(1),
  problem: z.string(),
  approach: z.array(z.string()).min(1),
  outcomes: z.array(z.string()).min(1),
  myPart: z.array(z.string()).optional(),
  links: z
    .object({
      live: z.url().optional(),
      source: z.url().optional(),
      api: z.url().optional(),
      apiSource: z.url().optional(),
    })
    .default({}),
  /** Designed cover used when there is no screenshot. */
  coverArt: coverArtSchema,
});

export const shotSchema = imageSchema.extend({
  device: z.enum(["desktop", "mobile", "detail"]),
});

export const projectMediaSchema = z.object({
  shots: z.array(shotSchema),
});

export type Social = z.infer<typeof socialSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type CoverArt = z.infer<typeof coverArtSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
export type ProjectRecord = z.infer<typeof projectSchema>;
export type Shot = z.infer<typeof shotSchema>;
export type ProjectMedia = z.infer<typeof projectMediaSchema>;

/** A project as pages receive it: content record plus its screenshots. */
export type Project = ProjectRecord & { media: ProjectMedia };

export {
  CATEGORY_LABELS,
  CONTEXT_LABELS,
  CONTRIBUTION_LABELS,
  PROJECT_CATEGORIES,
  type ProjectCategory,
} from "@/lib/content-labels";
