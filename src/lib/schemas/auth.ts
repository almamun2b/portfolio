import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

export const signInSchema = z.object({
  email: emailSchema,
  // No policy check on sign-in: it must not reveal the rules, only fail.
  password: z.string().min(1, "Enter your password.").max(128),
  next: z.string().max(512).optional(),
});
export type SignInInput = z.input<typeof signInSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(128),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm the new password."),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "Choose a password you have not used just now.",
  });
export type ChangePasswordInput = z.input<typeof changePasswordSchema>;
