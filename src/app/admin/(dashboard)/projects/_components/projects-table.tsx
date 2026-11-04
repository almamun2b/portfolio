import { FolderKanban, Star } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { Paginated, ProjectAdminDTO } from "@/lib/dto";
import { formatRelative } from "@/lib/format";
import type { ProjectListParams } from "@/lib/schemas/projects";
import type { SearchParamsInput } from "@/lib/url-state";
import { ProjectRowActions } from "./project-row-actions";
import { PublishBadge } from "./publish-badge";

const PATH = "/admin/projects";

const columns: Column<ProjectAdminDTO>[] = [
  {
    id: "title",
    header: "Project",
    sortKey: "title",
    cell: (p) => (
      <div className="min-w-0">
        <Link
          href={`/admin/projects/${p.id}`}
          className="block truncate rounded-md font-medium hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-ring"
        >
          {p.title}
          {p.featured ? (
            <Star
              aria-label="Featured"
              className="ml-1.5 inline size-3.5 fill-current align-baseline text-secondary-strong"
            />
          ) : null}
        </Link>
        <span className="block truncate font-mono text-xs text-muted-foreground">
          {p.slug}
        </span>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    sortKey: "status",
    hideBelow: "sm",
    cell: (p) => <PublishBadge status={p.status} />,
  },
  {
    id: "categories",
    header: "Categories",
    hideBelow: "lg",
    cell: (p) => (
      <span className="text-muted-foreground">
        {p.categories.map((c) => c.name).join(", ")}
      </span>
    ),
  },
  {
    id: "year",
    header: "Year",
    sortKey: "year",
    hideBelow: "md",
    cell: (p) => <span className="tabular-nums">{p.year}</span>,
  },
  {
    id: "sortOrder",
    header: "Order",
    sortKey: "sortOrder",
    hideBelow: "md",
    cell: (p) => <span className="tabular-nums">{p.sortOrder}</span>,
  },
  {
    id: "updatedAt",
    header: "Updated",
    sortKey: "updatedAt",
    hideBelow: "lg",
    cell: (p) => (
      <time dateTime={p.updatedAt} className="text-muted-foreground">
        {formatRelative(p.updatedAt)}
      </time>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    srOnlyHeader: true,
    align: "right",
    cell: (p) => <ProjectRowActions project={p} />,
  },
];

export function ProjectsTable({
  data,
  params,
  searchParams,
}: {
  data: Paginated<ProjectAdminDTO>;
  params: ProjectListParams;
  searchParams: SearchParamsInput;
}) {
  const filtered = Boolean(params.searchTerm || params.status);
  return (
    <Card>
      {data.meta.total === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={
            filtered ? "No projects match your filters" : "No projects yet"
          }
          description={
            filtered
              ? "Try a different search or clear the filters."
              : "Add your first project to show it on the site."
          }
          action={
            <ButtonLink
              href={filtered ? PATH : "/admin/projects/new"}
              variant="outline"
            >
              {filtered ? "Clear filters" : "Add project"}
            </ButtonLink>
          }
        />
      ) : (
        <>
          <DataTable
            caption="Projects"
            columns={columns}
            rows={data.data}
            getRowId={(p) => p.id}
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
