import type { ReactNode } from "react";
import { cn } from "cn";

/**
 * Wraps a list page's toolbar and table. Search, filters, sorting and
 * pagination are URL navigations that keep the old table on screen until the
 * server answers; any control that is navigating renders a `data-pending`
 * element (see <PendingMark> and useUrlState), and <ListBody> dims while one
 * exists. No shared client state, and the first server render shows no loader.
 */
export function ListRegion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group/list flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}

export function ListBody({ children }: { children: ReactNode }) {
  return (
    <div className="transition-opacity duration-150 group-has-[[data-pending]]/list:pointer-events-none group-has-[[data-pending]]/list:opacity-60">
      {children}
    </div>
  );
}
