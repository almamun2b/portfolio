"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { safeAdminPath } from "@/lib/auth/safe-path";
import { signInSchema } from "@/lib/schemas/auth";
import { publicAction } from "@/server/core/action";
import { AppError } from "@/server/core/errors/app-error";
import { signIn, signOut } from "./auth.config";
import { assertSignInAllowed } from "./auth.service";

const GENERIC = "Email or password is incorrect.";

export const signInAction = publicAction(
  "auth.signIn",
  signInSchema,
  async (data) => {
    await assertSignInAllowed(data.email);
    try {
      // On success this throws NEXT_REDIRECT, which publicAction lets through.
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirectTo: safeAdminPath(data.next),
      });
    } catch (error) {
      if (error instanceof AuthError) {
        throw new AppError(401, GENERIC, "UNAUTHORIZED");
      }
      throw error;
    }
  },
);

export async function signOutAction(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/admin/sign-in");
}
