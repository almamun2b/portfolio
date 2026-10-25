import { ShieldCheck } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { safeAdminPath } from "@/lib/auth/safe-path";
import { first } from "@/lib/url-state";
import { getAdmin } from "@/server/dal/auth";
import { SignInForm } from "./_components/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: PageProps<"/admin/sign-in">) {
  const next = first((await searchParams).next);
  if (await getAdmin()) redirect(safeAdminPath(next) as Route);

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-2xl bg-gradient-button text-white shadow-button"
        >
          <ShieldCheck className="size-7" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Admin sign-in</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage the site. Access is limited to administrators.
          </p>
        </div>
      </div>
      <Card className="p-6 sm:p-8">
        <SignInForm next={next} />
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="rounded-md text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          Back to the website
        </Link>
      </p>
    </>
  );
}
