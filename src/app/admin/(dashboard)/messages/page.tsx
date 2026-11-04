import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { FilterSelect } from "@/components/ui/filter-select";
import { ListBody, ListRegion } from "@/components/ui/list-region";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { messageListParamsSchema } from "@/lib/schemas/messages";
import { first, firstOf, withParams } from "@/lib/url-state";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listMessages } from "@/server/modules/messages/messages.service";
import { MessagesTable } from "./_components/messages-table";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: PageProps<"/admin/messages">) {
  await requireAdmin();
  const query = await searchParams;
  const params = messageListParamsSchema.parse(
    firstOf(query, [
      "page",
      "limit",
      "searchTerm",
      "status",
      "sortBy",
      "sortOrder",
    ]),
  );
  const data = await listMessages(params);
  if (data.meta.total > 0 && params.page > data.meta.totalPage) {
    redirect(
      withParams("/admin/messages", query, {
        page: data.meta.totalPage,
      }) as Route,
    );
  }

  return (
    <ListRegion>
      <PageHeader
        title="Messages"
        description="What visitors sent through the contact form. Reply by email; mark a message read or archive it when you're done."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          action="/admin/messages"
          label="Search messages"
          placeholder="Search by name, email, or text"
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
            { value: "NEW", label: "New" },
            { value: "READ", label: "Read" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
      </div>
      <ListBody>
        <MessagesTable data={data} params={params} searchParams={query} />
      </ListBody>
    </ListRegion>
  );
}
