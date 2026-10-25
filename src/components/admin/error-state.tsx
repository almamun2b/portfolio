"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Body of every admin `error.tsx`: calm message, retry, and a reference id. */
export function ErrorState({
  error,
  reset,
  title = "This page could not load",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  return (
    <Card
      role="alert"
      className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="grid size-14 place-items-center rounded-2xl border border-error/40 bg-error/10 text-error"
      >
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong on our side. Try again; if it keeps happening
        {error.digest ? (
          <>
            , quote reference{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              {error.digest}
            </code>
          </>
        ) : null}
        .
      </p>
      <Button onClick={reset}>
        <RotateCcw aria-hidden="true" /> Try again
      </Button>
    </Card>
  );
}
