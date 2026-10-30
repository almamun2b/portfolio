import { cn } from "cn";
import { LoaderCircle } from "lucide-react";

/** Inline loading glyph. Pair it with text or an aria-live message. */
export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={cn("size-4 motion-safe:animate-spin", className)}
    />
  );
}

/** Centered spinner with an accessible status message, for whole-panel loads. */
export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-40 items-center justify-center gap-3 text-muted-foreground"
    >
      <Spinner className="size-5 text-primary-strong" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
