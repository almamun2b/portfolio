import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { ADMIN_SIGN_IN, isAdminRole } from "@/lib/auth/safe-path";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { DomainError } from "@/server/errors";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN";
}

/** The Auth.js session (null when signed out or the Session row is dead). Once per request. */
export const getSession = cache(() => auth());

/**
 * The signed-in admin, re-read from the database so a demotion or disabling
 * takes effect on the next request, not when the cookie expires. Never
 * redirects: for Server Actions and DAL writes.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await getSession();
  const id = session?.user.id;
  if (!id) return null;
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, status: true },
  });
  if (user?.status !== "ACTIVE" || !isAdminRole(user.role)) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
});

/**
 * For pages, layouts, and DAL reads. No session -> sign-in page; a session
 * without the admin role gets a 404 so the area isn't revealed.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (admin) return admin;
  if (await getSession()) notFound();
  redirect(ADMIN_SIGN_IN);
}

/** For DAL writes: throws a DomainError that the action layer turns into a result. */
export async function assertAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) {
    throw new DomainError(
      "UNAUTHORIZED",
      "Your session has ended. Sign in again.",
    );
  }
  return admin;
}
