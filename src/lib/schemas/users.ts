import { z } from "zod";
import {
  emailSchema,
  idSchema,
  listBase,
  nameSchema,
  passwordSchema,
  sortByParam,
  sortOrder,
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
  sortBy: sortByParam(USER_SORT_KEYS, "createdAt"),
  sortOrder,
});
export type UserListParams = z.output<typeof userListParamsSchema>;

/** What the API and the service accept. The form adds a confirmation field. */
export const createUserBodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
export type CreateUserInput = z.input<typeof createUserBodySchema>;

export const createUserSchema = createUserBodySchema
  .extend({ confirmPassword: z.string().min(1, "Confirm the password.") })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const updateUserBodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
});
export const updateUserSchema = updateUserBodySchema.extend({ id: idSchema });
export type UpdateUserInput = z.input<typeof updateUserSchema>;

export const setPasswordBodySchema = z.object({ password: passwordSchema });

export const setPasswordSchema = setPasswordBodySchema
  .extend({
    id: idSchema,
    confirmPassword: z.string().min(1, "Confirm the password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type SetPasswordInput = z.input<typeof setPasswordSchema>;

export const userIdSchema = z.object({ id: idSchema });

export const setStatusBodySchema = z.object({ status: z.enum(USER_STATUSES) });
export const setStatusSchema = setStatusBodySchema.extend({ id: idSchema });

/** Revoking one session: the owner id is re-derived server-side. */
export const revokeSessionSchema = z.object({ sessionId: idSchema });
