import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterSelect } from "@/components/ui/filter-select";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { AUDIT_AREAS, auditLabel, auditTone } from "@/lib/audit-labels";
import type { AuditLogDTO } from "@/lib/dto";
import { formatDateTime } from "@/lib/format";
import { auditListParamsSchema } from "@/lib/schemas/audit";
import { first, withParams } from "@/lib/url-state";
import { listAuditLogs } from "@/server/dal/audit";
import { requireAdmin } from "@/server/dal/auth";

export const metadata: Metadata = { title: "Audit log" };

const PATH = "/admin/audit-log";

const columns: Column<AuditLogDTO>[] = [
  {
    id: "when",
    header: "When",
    cell: (log) => (
      <time
        dateTime={log.createdAt}
        className="whitespace-nowrap text-muted-foreground"
      >
        {formatDateTime(log.createdAt)}
      </time>
    ),
  },
  {
    id: "event",
    header: "Event",
    cell: (log) => (
      <Badge variant={auditTone(log.action)}>{auditLabel(log.action)}</Badge>
    ),
  },
  {
    id: "actor",
    header: "Who",
    cell: (log) => (
      <span className="block max-w-56 truncate">
        {log.actor ? (log.actor.name ?? log.actor.email) : "Unknown visitor"}
      </span>
    ),
  },
  {
    id: "detail",
    header: "Detail",
    hideBelow: "md",
    cell: (log) => (
      <span className="block max-w-64 truncate text-muted-foreground">
        {typeof log.metadata?.email === "string"
          ? log.metadata.email
          : (log.targetId ?? "—")}
      </span>
    ),
  },
  {
    id: "ip",
    header: "IP",
    hideBelow: "lg",
    cell: (log) => (
      <span className="font-mono text-xs text-muted-foreground">
        {log.ip ?? "—"}
      </span>
    ),
  },
];

export default async function AuditLogPage({
  searchParams,
}: PageProps<"/admin/audit-log">) {
  await requireAdmin();
  const query = await searchParams;
  const params = auditListParamsSchema.parse({
    page: first(query.page),
    perPage: first(query.perPage),
    q: first(query.q),
    area: first(query.area),
    dir: first(query.dir),
  });
  const data = await listAuditLogs(params);
  if (data.total > 0 && params.page > data.pageCount) {
    redirect(withParams(PATH, query, { page: data.pageCount }) as Route);
  }
  const filtered = Boolean(params.q || params.area);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit log"
        description="Sign-ins and every change made in this console, newest first."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          action={PATH}
          label="Search the audit log"
          placeholder="Search by event or email"
          defaultValue={params.q}
          preserve={{ area: params.area, perPage: first(query.perPage) }}
        />
        <FilterSelect
          param="area"
          label="Filter by area"
          value={params.area}
          allLabel="All areas"
          options={AUDIT_AREAS.map((a) => ({ value: a.value, label: a.label }))}
        />
      </div>
      <Card>
        {data.total === 0 ? (
          <EmptyState
            icon={ScrollText}
            title={filtered ? "No events match" : "No events yet"}
            description={
              filtered
                ? "Try a different search or area."
                : "Activity appears here as it happens."
            }
            action={
              filtered ? (
                <ButtonLink href={PATH} variant="outline">
                  Clear filters
                </ButtonLink>
              ) : undefined
            }
          />
        ) : (
          <>
            <DataTable
              caption="Audit log"
              columns={columns}
              rows={data.items}
              getRowId={(log) => log.id}
              pathname={PATH}
              searchParams={query}
            />
            <Pagination
              pathname={PATH}
              searchParams={query}
              page={data.page}
              perPage={data.perPage}
              total={data.total}
              pageCount={data.pageCount}
            />
          </>
        )}
      </Card>
    </div>
  );
}
