import { cn } from "cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { PAGE_SIZES } from "@/lib/schemas/common";
import type { SearchParamsInput } from "@/lib/url-state";
import { withParams } from "@/lib/url-state";

const chip =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** 1 … 4 5 [6] 7 8 … 20, as numbers and gaps (null). */
function windowed(page: number, count: number): (number | null)[] {
  const pages = new Set(
    [1, count, page - 1, page, page + 1].filter((n) => n >= 1 && n <= count),
  );
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && n - prev > 1) out.push(null);
    out.push(n);
  });
  return out;
}

/** URL-driven pagination: every control is a link, so it works without JS. */
export function Pagination({
  pathname,
  searchParams,
  page,
  perPage,
  total,
  pageCount,
  className,
}: {
  pathname: string;
  searchParams: SearchParamsInput;
  page: number;
  perPage: number;
  total: number;
  pageCount: number;
  className?: string;
}) {
  const href = (patch: Record<string, string | number | undefined>) =>
    withParams(pathname, searchParams, patch) as Route;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-muted-foreground" aria-live="polite">
        Showing <data value={from}>{from}</data>–<data value={to}>{to}</data> of{" "}
        <data value={total}>{total}</data>
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label="Rows per page"
        >
          <span className="text-muted-foreground">Rows</span>
          {PAGE_SIZES.map((size) => (
            <Link
              key={size}
              href={href({
                perPage: size === 10 ? undefined : size,
                page: undefined,
              })}
              aria-current={size === perPage ? "true" : undefined}
              className={cn(
                chip,
                size === perPage
                  ? "border-primary bg-muted text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {size}
            </Link>
          ))}
        </div>
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
          <PageLink
            disabled={page <= 1}
            href={href({ page: page - 1 || undefined })}
            label="Previous page"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </PageLink>
          {windowed(page, pageCount).map((n, i) =>
            n === null ? (
              <span
                key={`gap-${String(i)}`}
                aria-hidden="true"
                className="px-1 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Link
                key={n}
                href={href({ page: n === 1 ? undefined : n })}
                aria-label={`Page ${String(n)}`}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  chip,
                  n === page
                    ? "border-transparent bg-gradient-button text-primary-foreground"
                    : "border-border-strong hover:border-primary hover:bg-muted",
                )}
              >
                {n}
              </Link>
            ),
          )}
          <PageLink
            disabled={page >= pageCount}
            href={href({ page: page + 1 })}
            label="Next page"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </PageLink>
        </nav>
      </div>
    </div>
  );
}

function PageLink({
  disabled,
  href,
  label,
  children,
}: {
  disabled: boolean;
  href: Route;
  label: string;
  children: React.ReactNode;
}) {
  const classes = cn(chip, "border-border-strong");
  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={label}
        className={cn(classes, "opacity-40")}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(classes, "hover:border-primary hover:bg-muted")}
    >
      {children}
    </Link>
  );
}
