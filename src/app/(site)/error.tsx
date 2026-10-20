"use client";

import { RotateCcw } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex min-h-[60dvh] flex-col items-start justify-center gap-6 py-20">
      <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] leading-tight font-bold tracking-tight">
        Something went wrong.
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        This page failed to load. Try again; if it keeps happening, please let
        me know
        {error.digest ? (
          <>
            {" "}
            and mention reference{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
              {error.digest}
            </code>
          </>
        ) : null}
        .
      </p>
      <Button size="lg" onClick={reset}>
        <RotateCcw aria-hidden="true" /> Try again
      </Button>
    </Container>
  );
}
