import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { ListBody, ListRegion } from "@/components/ui/list-region";
import { PageHeader } from "@/components/ui/page-header";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import { userListParamsSchema } from "@/lib/schemas/users";
import { firstOf, first, withParams } from "@/lib/url-state";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listUsers } from "@/server/modules/users/users.service";
import { AddUserButton } from "./_components/add-user-button";
import { UsersTable } from "./_components/users-table";

export const metadata: Metadata = { title: "Users" };

// Blocking on purpose: a click keeps the current page until this one is
// ready (see AGENTS.md › Navigation), so there is no skeleton to validate.
export const instant = false;

export default async function UsersPage({
  searchParams,
}: PageProps<"/admin/users">) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const params = userListParamsSchema.parse(
    firstOf(query, [
      "page",
      "limit",
      "searchTerm",
      "status",
      "sortBy",
      "sortOrder",
    ]),
  );
  const data = await listUsers(params);
  if (data.meta.total > 0 && params.page > data.meta.totalPage) {
    redirect(
      withParams("/admin/users", query, { page: data.meta.totalPage }) as Route,
    );
  }

  return (
    <ListRegion>
      <PageHeader
        title="Users"
        description="Everyone who can sign in to this console. Disable an account to cut off access without deleting it."
        actions={<AddUserButton />}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          action="/admin/users"
          label="Search users"
          placeholder="Search by name or email"
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
            { value: "ACTIVE", label: "Active" },
            { value: "DISABLED", label: "Disabled" },
          ]}
        />
      </div>
      <ListBody>
        <UsersTable
          data={data}
          params={params}
          searchParams={query}
          currentUserId={admin.id}
        />
      </ListBody>
    </ListRegion>
  );
}
