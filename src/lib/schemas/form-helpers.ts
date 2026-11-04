import { z } from "zod";

// Server Actions receive flat FormData (Object.fromEntries), so lists,
// booleans and nested values travel as strings. These helpers accept both the
// form encoding and the native JSON value, which lets one zod schema back the
// form and the API.

/** Empty and whitespace-only strings become undefined (optional text inputs). */
export function optionalText<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    schema.optional(),
  );
}

/** "a, b" or ["a", "b"] -> string[] */
export function csvField<T extends z.ZodType>(item: T) {
  return z.preprocess(
    (v) =>
      typeof v === "string"
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : v,
    z.array(item),
  );
}

/** One item per non-empty line, or a native string[]. */
export function linesField(item: z.ZodString = z.string().max(600)) {
  return z.preprocess(
    (v) =>
      typeof v === "string"
        ? v
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean)
        : v,
    z.array(item),
  );
}

/** HTML checkbox ("on") or boolean. Absent means false. */
export const checkbox = z.preprocess(
  (v) => v === "on" || v === "true" || v === true,
  z.boolean(),
);

/** A JSON-encoded hidden input, or the already-parsed value. */
export function jsonField<T extends z.ZodType>(schema: T) {
  return z.preprocess((v) => {
    if (typeof v !== "string") return v;
    try {
      return JSON.parse(v) as unknown;
    } catch {
      return null;
    }
  }, schema);
}

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Use at least 2 characters.")
  .max(80, "Keep the slug under 80 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and dashes.",
  );

/** https URL or a path served from /public. */
export const imageUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) =>
      (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\/\S+$/.test(v),
    "Use an https:// URL or a path like /projects/name/shot.jpg.",
  );

export const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export const publishStatus = z.enum(PUBLISH_STATUSES);

export const sortOrderField = z.coerce.number().int().min(0).max(100000);
