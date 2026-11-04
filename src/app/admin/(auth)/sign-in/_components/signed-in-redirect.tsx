import type { Route } from "next";
import { redirect } from "next/navigation";
import { safeAdminPath } from "@/lib/auth/safe-path";
import { first, type SearchParamsInput } from "@/lib/url-state";
import { getAdmin } from "@/server/modules/auth/auth.guard";

/**
 * Sends an already signed-in admin on to `?next=` (or the dashboard). It
 * renders nothing, so it can stream in behind its own <Suspense> without the
 * sign-in form having to wait for the request.
 */
export async function SignedInRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const next = first((await searchParams).next);
  if (await getAdmin()) redirect(safeAdminPath(next) as Route);
  return null;
}
