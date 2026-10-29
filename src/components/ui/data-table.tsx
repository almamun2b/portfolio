import { cn } from "cn";
import type { ReactNode } from "react";
import type { SearchParamsInput } from "@/lib/url-state";
import { withParams } from "@/lib/url-state";
import {
  SortHeader,
  Table,
  TableScroll,
  TBody,
  TD,
  TH,
  THead,
  TRow,
} from "./table";

export interface Column<Row> {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  /** Query value for ?sort=; omit for columns that can't sort. */
  sortKey?: string;
  /** Hide below this breakpoint so phones keep only the essentials. */
  hideBelow?: "sm" | "md" | "lg";
  align?: "left" | "right";
  /** Visually hidden header (row actions). */
  srOnlyHeader?: boolean;
}

const HIDE = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

/**
 * Server-rendered table: sorting is links, so state lives in the URL and the
 * view is shareable. Pair with <Pagination> and a toolbar. `caption` names the
 * table for screen readers.
 */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowId,
  pathname,
  searchParams,
  sortBy,
  sortOrder,
  className,
}: {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  pathname: string;
  searchParams: SearchParamsInput;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  className?: string;
}) {
  return (
    <TableScroll className={className}>
      <Table>
        <caption className="sr-only">{caption}</caption>
        <THead>
          <tr>
            {columns.map((column) => {
              const cls = cn(
                column.hideBelow && HIDE[column.hideBelow],
                column.align === "right" && "text-right",
              );
              if (column.sortKey) {
                const active = sortBy === column.sortKey;
                const nextOrder =
                  active && sortOrder === "asc" ? "desc" : "asc";
                return (
                  <SortHeader
                    key={column.id}
                    label={column.header}
                    active={active}
                    dir={sortOrder ?? "asc"}
                    href={withParams(pathname, searchParams, {
                      sortBy: column.sortKey,
                      sortOrder: nextOrder,
                    })}
                    className={cls}
                  />
                );
              }
              return (
                <TH key={column.id} className={cls}>
                  {column.srOnlyHeader ? (
                    <span className="sr-only">{column.header}</span>
                  ) : (
                    column.header
                  )}
                </TH>
              );
            })}
          </tr>
        </THead>
        <TBody>
          {rows.map((row) => (
            <TRow key={getRowId(row)}>
              {columns.map((column) => (
                <TD
                  key={column.id}
                  className={cn(
                    column.hideBelow && HIDE[column.hideBelow],
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.cell(row)}
                </TD>
              ))}
            </TRow>
          ))}
        </TBody>
      </Table>
    </TableScroll>
  );
}
