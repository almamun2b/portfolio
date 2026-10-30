import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "./_components/sign-in-form";
import { SignedInRedirect } from "./_components/signed-in-redirect";

export const metadata: Metadata = { title: "Sign in" };

// Everything visible is prerendered, so the form is in the first HTML (and
// works without JS). Only two invisible things depend on the request: the
// `?next=` field (inside the form) and the redirect for a signed-in admin.
export default function SignInPage({
  searchParams,
}: PageProps<"/admin/sign-in">) {
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
        <SignInForm />
        <Suspense fallback={null}>
          <SignedInRedirect searchParams={searchParams} />
        </Suspense>
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
