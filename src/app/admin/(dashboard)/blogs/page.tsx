import { Plus } from "lucide-react";
import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { FilterSelect } from "@/components/ui/filter-select";
import { ListBody, ListRegion } from "@/components/ui/list-region";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { postListParamsSchema } from "@/lib/schemas/posts";
import { first, firstOf, withParams } from "@/lib/url-state";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listPosts } from "@/server/modules/posts/posts.service";
import { PostsTable } from "./_components/posts-table";

export const metadata: Metadata = { title: "Blogs" };

export default async function BlogsPage({
  searchParams,
}: PageProps<"/admin/blogs">) {
  await requireAdmin();
  const query = await searchParams;
  const params = postListParamsSchema.parse(
    firstOf(query, [
      "page",
      "limit",
      "searchTerm",
      "status",
      "sortBy",
      "sortOrder",
    ]),
  );
  const data = await listPosts(params);
  if (data.meta.total > 0 && params.page > data.meta.totalPage) {
    redirect(
      withParams("/admin/blogs", query, { page: data.meta.totalPage }) as Route,
    );
  }

  return (
    <ListRegion>
      <PageHeader
        title="Blogs"
        description="Articles and notes for /blog. Drafts stay private until you publish them."
        actions={
          <ButtonLink href="/admin/blogs/new">
            <Plus aria-hidden="true" /> New post
          </ButtonLink>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          action="/admin/blogs"
          label="Search posts"
          placeholder="Search by title or text"
          defaultValue={params.searchTerm}
          preserve={{
            status: params.status,
            sortBy: first(query.sortBy),
            sortOrder: first(query.sortOrder),
            limit: first(query.limit),
          }}
        />
        <FilterSelect
          param="status"
          label="Filter by status"
          value={params.status}
          allLabel="All statuses"
          options={[
            { value: "PUBLISHED", label: "Published" },
            { value: "DRAFT", label: "Draft" },
          ]}
        />
      </div>
      <ListBody>
        <PostsTable data={data} params={params} searchParams={query} />
      </ListBody>
    </ListRegion>
  );
}
