import { Newspaper } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { Paginated, PostDTO } from "@/lib/dto";
import { formatRelative } from "@/lib/format";
import type { PostListParams } from "@/lib/schemas/posts";
import type { SearchParamsInput } from "@/lib/url-state";
import { PostRowActions } from "./post-row-actions";
import { PublishBadge } from "../../projects/_components/publish-badge";

const PATH = "/admin/blogs";

const columns: Column<PostDTO>[] = [
  {
    id: "title",
    header: "Post",
    sortKey: "title",
    cell: (p) => (
      <div className="min-w-0">
        <Link
          href={`/admin/blogs/${p.id}`}
          className="block truncate rounded-md font-medium hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-ring"
        >
          {p.title}
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
        {p.categories.map((c) => c.name).join(", ") || "None"}
      </span>
    ),
  },
  {
    id: "publishedAt",
    header: "Published",
    sortKey: "publishedAt",
    hideBelow: "md",
    cell: (p) =>
      p.publishedAt ? (
        <time dateTime={p.publishedAt} className="text-muted-foreground">
          {formatRelative(p.publishedAt)}
        </time>
      ) : (
        <span className="text-muted-foreground">Not yet</span>
      ),
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
    cell: (p) => <PostRowActions post={p} />,
  },
];

export function PostsTable({
  data,
  params,
  searchParams,
}: {
  data: Paginated<PostDTO>;
  params: PostListParams;
  searchParams: SearchParamsInput;
}) {
  const filtered = Boolean(params.searchTerm || params.status);
  return (
    <Card>
      {data.meta.total === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={filtered ? "No posts match your filters" : "No posts yet"}
          description={
            filtered
              ? "Try a different search or clear the filters."
              : "Write your first post. It stays a draft until you publish it."
          }
          action={
            <ButtonLink
              href={filtered ? PATH : "/admin/blogs/new"}
              variant="outline"
            >
              {filtered ? "Clear filters" : "New post"}
            </ButtonLink>
          }
        />
      ) : (
        <>
          <DataTable
            caption="Blog posts"
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
