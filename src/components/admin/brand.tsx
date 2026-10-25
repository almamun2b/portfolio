import { cn } from "cn";
import Link from "next/link";

/** The logo tile with the console name; links to the dashboard. */
export function AdminBrand({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={"/admin"}
      className={cn(
        "group flex h-16 items-center gap-3 rounded-2xl px-4 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-[0.85rem] bg-gradient-button font-display text-lg font-bold text-white shadow-[0_6px_20px_var(--glow-primary)] transition-transform duration-500 ease-spring group-hover:scale-105 group-hover:-rotate-6"
      >
        M
      </span>
      <span
        className={cn(
          "flex min-w-0 flex-col leading-none whitespace-nowrap transition-opacity duration-200",
          collapsed && "w-0 overflow-hidden opacity-0",
        )}
      >
        <span className="font-display text-lg font-bold tracking-tight">
          Mamun
        </span>
        <span className="mt-1 text-[0.72rem] text-muted-foreground">
          Admin console
        </span>
      </span>
      <span className="sr-only">Admin dashboard</span>
    </Link>
  );
}
