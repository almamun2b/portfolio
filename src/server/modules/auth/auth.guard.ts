import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { ADMIN_SIGN_IN, isAdminRole } from "@/lib/auth/safe-path";
import { AppError } from "@/server/core/errors/app-error";
import { auth } from "./auth.config";
import { readAdminProfile } from "./auth.model";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN";
}

/**
 * The Auth.js session (null when signed out or the Session row is dead). Once
 * per request. Auth.js draws a random CSRF token on every call, which a
 * prerender may not do, so `connection()` first marks this as request-time
 * work (a session is per-request by nature anyway).
 */
export const getSession = cache(async () => {
  await connection();
  return auth();
});

/**
 * The signed-in admin, re-read so a demotion or disabling takes effect on the
 * next request, not when the cookie expires. Never redirects: for Server
 * Actions, Route Handlers and service writes. Runs once per request.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await getSession();
  const id = session?.user.id;
  if (!id) return null;
  const user = await readAdminProfile(id);
  if (user?.status !== "ACTIVE" || !isAdminRole(user.role)) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
});

/**
 * For pages, layouts, and service reads. No session -> sign-in page; a
 * session without the admin role gets a 404 so the area isn't revealed.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (admin) return admin;
  if (await getSession()) notFound();
  redirect(ADMIN_SIGN_IN);
}

/** For service writes: throws an AppError that the action/route layer turns into a result. */
export async function assertAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) throw AppError.unauthorized();
  return admin;
}
