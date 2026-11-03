import { Card } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/data-table";
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

/** Toolbar + table card, for list pages. */
export function ListPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderSkeleton />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 w-full sm:max-w-sm" />
        <Skeleton className="h-11 w-full sm:w-44" />
      </div>
      <Card>
        <TableSkeleton rows={8} columns={5} />
      </Card>
    </div>
  );
}

/**
 * Stands in for the signed-in user block while the session resolves: same
 * border, height and avatar as UserMenu, so nothing shifts when it arrives.
 */
export function UserMenuSkeleton() {
  return (
    <div role="status" className="border-t border-border p-3">
      <span className="sr-only">Loading account</span>
      <div className="flex h-14 items-center gap-3 p-2">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 collapsed:hidden">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32 max-w-full" />
        </div>
      </div>
    </div>
  );
}

/** Same footprint as the dashboard's recent-activity card. */
export function ActivitySkeleton() {
  return (
    <Card role="status" className="flex flex-col gap-4 p-5">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-5 w-40" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </Card>
  );
}

/**
 * A page with a header and one content card. Each admin segment re-exports it
 * as its own `loading.tsx`: a client navigation between sibling pages only
 * re-renders below their shared layout, so the dashboard-level boundary can't
 * cover it and every page needs a boundary of its own to navigate instantly.
 */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <HeaderSkeleton />
      <Card role="status" className="flex flex-col gap-4 p-6">
        <span className="sr-only">Loading</span>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-lg" />
        <Skeleton className="mt-2 h-11 w-40 rounded-full" />
      </Card>
    </div>
  );
}
