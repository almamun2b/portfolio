import { z } from "zod";
import {
  COVER_ARTS,
  PROJECT_CONTEXTS,
  PROJECT_CONTRIBUTIONS,
} from "@/lib/content-labels";
import { TECH_IDS } from "@/lib/tech-ids";
import { idSchema, listBase, sortByParam } from "./common";
import {
  checkbox,
  csvField,
  imageUrlSchema,
  jsonField,
  linesField,
  optionalText,
  publishStatus,
  slugSchema,
  sortOrderField,
} from "./form-helpers";

export const PROJECT_SORT_KEYS = [
  "title",
  "year",
  "status",
  "sortOrder",
  "updatedAt",
  "createdAt",
] as const;

export const projectListParamsSchema = z.object({
  ...listBase,
  status: publishStatus.optional().catch(undefined),
  sortBy: sortByParam(PROJECT_SORT_KEYS, "sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).catch("asc"),
});
export type ProjectListParams = z.output<typeof projectListParamsSchema>;

export const SHOT_DEVICES = ["desktop", "mobile", "detail"] as const;

/** Sensible pixel sizes for a screenshot whose size the editor didn't enter. */
export const DEFAULT_SHOT_SIZE = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
  detail: { width: 1200, height: 800 },
} as const;

export const shotInputSchema = z.object({
  src: imageUrlSchema,
  alt: z.string().trim().min(1, "Describe the screenshot.").max(240),
  device: z.enum(SHOT_DEVICES),
  width: z.coerce.number().int().positive().max(10000).optional(),
  height: z.coerce.number().int().positive().max(10000).optional(),
});

const optionalUrl = optionalText(
  z.url("Enter a full URL starting with https://."),
);

export const projectBodySchema = z.object({
  title: z.string().trim().min(3, "Enter a title.").max(120),
  slug: slugSchema,
  tagline: z.string().trim().min(10).max(300),
  summary: z.string().trim().min(20).max(1500),
  context: z.enum(PROJECT_CONTEXTS),
  contribution: z.enum(PROJECT_CONTRIBUTIONS),
  role: z.string().trim().min(3).max(160),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Use a four-digit year."),
  featured: checkbox,
  status: publishStatus.default("DRAFT"),
  sortOrder: z.preprocess(
    (v) => (v === "" ? undefined : v),
    sortOrderField.optional(),
  ),
  stack: csvField(z.enum(TECH_IDS)).pipe(
    z.array(z.enum(TECH_IDS)).min(1, "Pick at least one technology."),
  ),
  problem: z.string().trim().min(10).max(1200),
  approach: linesField().pipe(
    z.array(z.string()).min(1, "Add at least one line."),
  ),
  outcomes: linesField().pipe(
    z.array(z.string()).min(1, "Add at least one line."),
  ),
  myPart: linesField().default([]),
  liveUrl: optionalUrl,
  sourceUrl: optionalUrl,
  apiUrl: optionalUrl,
  apiSourceUrl: optionalUrl,
  coverArt: z.enum(COVER_ARTS).default("terminal"),
  categoryIds: csvField(idSchema).pipe(
    z.array(idSchema).min(1, "Pick at least one category."),
  ),
  media: jsonField(z.array(shotInputSchema).max(24)).default([]),
});
export type ProjectInput = z.input<typeof projectBodySchema>;
export type ProjectBody = z.output<typeof projectBodySchema>;

export const createProjectSchema = projectBodySchema;
export const updateProjectSchema = projectBodySchema.extend({ id: idSchema });
export type UpdateProjectInput = z.input<typeof updateProjectSchema>;
export const projectIdSchema = z.object({ id: idSchema });
