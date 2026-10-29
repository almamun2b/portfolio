import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";

/** Matches PageHeader, so the title doesn't jump when content arrives. */
export function HeaderSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="flex items-start justify-between p-5">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="size-11 rounded-2xl" />
        </Card>
      ))}
    </div>
  );
}

/**
 * The whole admin frame while the session and sidebar cookie resolve. It is
 * the static shell of every dashboard route (prerendered), so the first paint
 * on a hard load already has the right layout; client navigations never see
 * it because the layout stays mounted.
 */
export function AdminFrameSkeleton() {
  return (
    <div role="status" className="min-h-dvh">
      <span className="sr-only">Loading</span>
      <aside
        aria-hidden="true"
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-border bg-card-solid p-4 lg:flex"
      >
        <Skeleton className="h-10 w-40" />
        <div className="flex flex-1 flex-col gap-2">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
      </aside>
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <div
          aria-hidden="true"
          className="flex h-16 items-center gap-3 border-b border-border px-4 sm:px-6"
        >
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-8">
            <HeaderSkeleton />
            <CardGridSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
