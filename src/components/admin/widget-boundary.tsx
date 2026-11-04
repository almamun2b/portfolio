"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { catchError, type ErrorInfo } from "next/error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function WidgetFallback(
  { title }: { title: string },
  { error, retry }: ErrorInfo,
) {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : null;
  return (
    <Card
      role="alert"
      className="flex flex-col items-start gap-3 border-error/40 p-5"
    >
      <p className="flex items-center gap-2 font-medium">
        <TriangleAlert aria-hidden="true" className="size-4 text-error" />
        {title} could not load
      </p>
      {digest ? (
        <p className="text-xs text-muted-foreground">Reference {digest}</p>
      ) : null}
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          retry();
        }}
      >
        <RotateCcw aria-hidden="true" /> Try again
      </Button>
    </Card>
  );
}

/**
 * Error boundary for one dashboard widget, so a failing query takes down its
 * own card and not the page. `retry()` re-renders it in a transition.
 */
export const WidgetBoundary = catchError(WidgetFallback);
