import { Tags } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { CategoryDTO, Paginated } from "@/lib/dto";
import type { CategoryListParams } from "@/lib/schemas/categories";
import type { SearchParamsInput } from "@/lib/url-state";
import { AddCategoryButton } from "./add-category-button";
import { CategoryRowActions } from "./category-row-actions";

const PATH = "/admin/categories";

const columns: Column<CategoryDTO>[] = [
  {
    id: "name",
    header: "Category",
    sortKey: "name",
    cell: (c) => (
      <div className="min-w-0">
        <span className="block truncate font-medium">{c.name}</span>
        <span className="block truncate font-mono text-xs text-muted-foreground">
          {c.slug}
        </span>
      </div>
    ),
  },
  {
    id: "projects",
    header: "Projects",
    hideBelow: "sm",
    cell: (c) => <span className="tabular-nums">{c.projectCount}</span>,
  },
  {
    id: "posts",
    header: "Posts",
    hideBelow: "sm",
    cell: (c) => <span className="tabular-nums">{c.postCount}</span>,
  },
  {
    id: "sortOrder",
    header: "Order",
    sortKey: "sortOrder",
    hideBelow: "md",
    cell: (c) => <span className="tabular-nums">{c.sortOrder}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    srOnlyHeader: true,
    align: "right",
    cell: (c) => <CategoryRowActions category={c} />,
  },
];

export function CategoriesTable({
  data,
  params,
  searchParams,
}: {
  data: Paginated<CategoryDTO>;
  params: CategoryListParams;
  searchParams: SearchParamsInput;
}) {
  const filtered = Boolean(params.searchTerm);
  return (
    <Card>
      {data.meta.total === 0 ? (
        <EmptyState
          icon={Tags}
          title={filtered ? "No categories match" : "No categories yet"}
          description={
            filtered
              ? "Try a different search."
              : "Add a category, then assign it to projects and posts."
          }
          action={
            filtered ? (
              <ButtonLink href={PATH} variant="outline">
                Clear search
              </ButtonLink>
            ) : (
              <AddCategoryButton />
            )
          }
        />
      ) : (
        <>
          <DataTable
            caption="Categories"
            columns={columns}
            rows={data.data}
            getRowId={(c) => c.id}
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
