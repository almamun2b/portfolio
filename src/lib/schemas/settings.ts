import { z } from "zod";
import { emailSchema } from "./common";
import { checkbox, csvField, linesField, optionalText } from "./form-helpers";
import { monthSchema, socialSchema, techIdSchema } from "./content";

export const SETTING_KEYS = ["profile", "socials"] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

const text = (max: number) => z.string().trim().min(1, "Required.").max(max);

/**
 * The editable profile as the settings form submits it. Lists travel as
 * textareas (one item per line) and pairs as "left | right" lines, then
 * `toProfile` maps this to the stored `Profile` document (profileSchema).
 */
export const profileFormSchema = z.object({
  name: text(80),
  shortName: text(40),
  role: text(100),
  roles: linesField().pipe(
    z.array(z.string()).min(1, "Add at least one role."),
  ),
  pitch: text(600),
  about: linesField(z.string().max(1500)).pipe(
    z.array(z.string()).min(1, "Add at least one paragraph."),
  ),
  location: text(100),
  timezone: text(100),
  email: emailSchema,
  phoneDisplay: text(40),
  phoneHref: z
    .string()
    .trim()
    .regex(/^tel:\+?\d+$/, "Use a value like tel:+8801610088700."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, "Digits only, 8 to 15."),
  availabilityOpen: checkbox,
  availabilityLabel: text(80),
  availabilityDetail: text(300),
  careerStart: monthSchema,
  primaryStack: csvField(techIdSchema).pipe(z.array(techIdSchema).min(1)),
  stack: csvField(techIdSchema).pipe(z.array(techIdSchema).min(1)),
  resumeHref: z
    .string()
    .trim()
    .regex(/^\/[^\s]+\.pdf$/, "Use a path like /resume.pdf."),
  resumeFileName: text(120),
  languages: linesField().default([]),
});
export type ProfileFormInput = z.input<typeof profileFormSchema>;

export const updateProfileSchema = profileFormSchema;

const socialRow = z.object({
  github: optionalText(z.url()),
  linkedin: optionalText(z.url()),
  x: optionalText(z.url()),
  facebook: optionalText(z.url()),
});
export const updateSocialsSchema = socialRow;
export const socialsStoredSchema = z.array(socialSchema);
