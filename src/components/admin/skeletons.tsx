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
