import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import { userListParamsSchema } from "@/lib/schemas/users";
import { first, withParams } from "@/lib/url-state";
import { requireAdmin } from "@/server/dal/auth";
import { listUsers } from "@/server/dal/users";
import { AddUserButton } from "./_components/add-user-button";
import { UsersTable } from "./_components/users-table";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage({
  searchParams,
}: PageProps<"/admin/users">) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const params = userListParamsSchema.parse({
    page: first(query.page),
    perPage: first(query.perPage),
    q: first(query.q),
    status: first(query.status),
    sort: first(query.sort),
    dir: first(query.dir),
  });
  const data = await listUsers(params);
  if (data.total > 0 && params.page > data.pageCount) {
    redirect(
      withParams("/admin/users", query, { page: data.pageCount }) as Route,
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
          defaultValue={params.q}
          preserve={{
            status: params.status,
            sort: first(query.sort),
            dir: first(query.dir),
            perPage: first(query.perPage),
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
      <UsersTable
        data={data}
        params={params}
        searchParams={query}
        currentUserId={admin.id}
      />
    </div>
  );
}
