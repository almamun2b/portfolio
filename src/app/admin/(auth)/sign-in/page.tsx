import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignInSkeleton } from "@/components/admin/skeletons";
import { Card } from "@/components/ui/card";
import { SignInPanel } from "./_components/sign-in-panel";

export const metadata: Metadata = { title: "Sign in" };

// Heading and card are static (prerendered); only the form depends on the
// request (?next= and an existing session), so only it streams in.
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
        <Suspense fallback={<SignInSkeleton />}>
          <SignInPanel searchParams={searchParams} />
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
