import { z } from "zod";
import {
  emailSchema,
  idSchema,
  listBase,
  nameSchema,
  passwordSchema,
  sortDir,
  sortParam,
} from "./common";

export const USER_STATUSES = ["ACTIVE", "DISABLED"] as const;
export const USER_SORT_KEYS = [
  "name",
  "email",
  "status",
  "lastLoginAt",
  "createdAt",
] as const;
export type UserSortKey = (typeof USER_SORT_KEYS)[number];

export const userListParamsSchema = z.object({
  ...listBase,
  status: z.enum(USER_STATUSES).optional().catch(undefined),
  sort: sortParam(USER_SORT_KEYS, "createdAt"),
  dir: sortDir,
});
export type UserListParams = z.output<typeof userListParamsSchema>;

export const createUserSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm the password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type CreateUserInput = z.input<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: idSchema,
  name: nameSchema,
  email: emailSchema,
});
export type UpdateUserInput = z.input<typeof updateUserSchema>;

export const setPasswordSchema = z
  .object({
    id: idSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm the password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type SetPasswordInput = z.input<typeof setPasswordSchema>;

export const userIdSchema = z.object({ id: idSchema });

export const setStatusSchema = z.object({
  id: idSchema,
  status: z.enum(USER_STATUSES),
});

/** Revoking one session: the owner id is re-derived server-side. */
export const revokeSessionSchema = z.object({ sessionId: idSchema });
