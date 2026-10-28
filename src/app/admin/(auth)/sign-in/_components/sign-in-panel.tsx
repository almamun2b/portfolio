import type { Route } from "next";
import { redirect } from "next/navigation";
import { safeAdminPath } from "@/lib/auth/safe-path";
import { first, type SearchParamsInput } from "@/lib/url-state";
import { getAdmin } from "@/server/modules/auth/auth.guard";
import { SignInForm } from "./sign-in-form";

/** Request-dependent part of the sign-in page: send signed-in admins onward, else show the form. */
export async function SignInPanel({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const next = first((await searchParams).next);
  if (await getAdmin()) redirect(safeAdminPath(next) as Route);
  return <SignInForm next={next} />;
}
