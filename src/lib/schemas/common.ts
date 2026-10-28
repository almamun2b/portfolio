import { z } from "zod";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/auth/password-params";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email is too long.")
  .pipe(z.email("Enter an email address like name@example.com."));

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter a name (at least 2 characters).")
  .max(80, "Keep the name under 80 characters.");

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Use at least ${String(PASSWORD_MIN)} characters.`)
  .max(PASSWORD_MAX, `Use at most ${String(PASSWORD_MAX)} characters.`)
  .refine((value) => /[a-z]/.test(value) && /[A-Z]/.test(value), {
    message: "Mix upper and lower case letters.",
  })
  .refine((value) => /\d/.test(value), {
    message: "Include at least one number.",
  });

export const idSchema = z.string().trim().min(1).max(64);

/** Page size choices offered by <Pagination> and accepted by the API. */
export const PAGE_SIZES = [10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Shared list params (page, limit, searchTerm), named like the QueryBuilder
 * and the Express starter's API. `.catch()` means a hand-edited URL falls
 * back to the default instead of crashing the page.
 */
export const listBase = {
  page: z.coerce.number().int().min(1).max(100_000).catch(1),
  limit: z.coerce
    .number()
    .int()
    .catch(DEFAULT_PAGE_SIZE)
    .transform((n) =>
      (PAGE_SIZES as readonly number[]).includes(n) ? n : DEFAULT_PAGE_SIZE,
    ),
  searchTerm: z.string().trim().max(100).catch("").default(""),
};

export function sortByParam<const T extends readonly [string, ...string[]]>(
  keys: T,
  fallback: T[number],
) {
  return z.enum(keys).catch(fallback);
}

export const sortOrder = z.enum(["asc", "desc"]).catch("desc");
