import { Inbox } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { MessageDTO, Paginated } from "@/lib/dto";
import { formatDateTime } from "@/lib/format";
import type { MessageListParams } from "@/lib/schemas/messages";
import type { SearchParamsInput } from "@/lib/url-state";
import { MessageStatusBadge } from "./message-status-badge";

const PATH = "/admin/messages";

const columns: Column<MessageDTO>[] = [
  {
    id: "name",
    header: "From",
    sortKey: "name",
    cell: (m) => (
      <div className="min-w-0">
        <Link
          href={`/admin/messages/${m.id}`}
          className={`block truncate rounded-md hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-ring ${m.status === "NEW" ? "font-semibold" : "font-medium"}`}
        >
          {m.name}
        </Link>
        <span className="block truncate text-xs text-muted-foreground">
          {m.email}
        </span>
      </div>
    ),
  },
  {
    id: "preview",
    header: "Message",
    hideBelow: "md",
    cell: (m) => (
      <span className="line-clamp-2 max-w-md text-muted-foreground">
        {m.subject ? (
          <strong className="font-medium">{m.subject}: </strong>
        ) : null}
        {m.body}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    sortKey: "status",
    hideBelow: "sm",
    cell: (m) => <MessageStatusBadge status={m.status} />,
  },
  {
    id: "createdAt",
    header: "Received",
    sortKey: "createdAt",
    cell: (m) => (
      <time dateTime={m.createdAt} className="text-muted-foreground">
        {formatDateTime(m.createdAt)}
      </time>
    ),
  },
  {
    id: "actions",
    header: "Open",
    srOnlyHeader: true,
    align: "right",
    cell: (m) => (
      <ButtonLink
        href={`/admin/messages/${m.id}` as Route}
        variant="outline"
        size="sm"
      >
        Open<span className="sr-only"> message from {m.name}</span>
      </ButtonLink>
    ),
  },
];

export function MessagesTable({
  data,
  params,
  searchParams,
}: {
  data: Paginated<MessageDTO>;
  params: MessageListParams;
  searchParams: SearchParamsInput;
}) {
  const filtered = Boolean(params.searchTerm || params.status);
  return (
    <Card>
      {data.meta.total === 0 ? (
        <EmptyState
          icon={Inbox}
          title={filtered ? "No messages match" : "No messages yet"}
          description={
            filtered
              ? "Try a different search or clear the filters."
              : "Messages from the contact form appear here."
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
            caption="Messages"
            columns={columns}
            rows={data.data}
            getRowId={(m) => m.id}
            pathname={PATH}
            searchParams={searchParams}
            sortBy={params.sortBy}
            sortOrder={params.sortOrder}
          />
          <Pagination
            pathname={PATH}
            searchParams={searchParams}
            meta={data.meta}
          />
        </>
      )}
    </Card>
  );
}
