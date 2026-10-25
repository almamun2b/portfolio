import { Users } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { formatDateTime, formatRelative } from "@/lib/format";
import type { Paginated, UserDTO } from "@/lib/dto";
import type { UserListParams } from "@/lib/schemas/users";
import type { SearchParamsInput } from "@/lib/url-state";
import { AddUserButton } from "./add-user-button";
import { UserRowActions } from "./user-row-actions";
import { UserStatusBadge } from "./user-status-badge";

const PATH = "/admin/users";

function columns(currentUserId: string): Column<UserDTO>[] {
  return [
    {
      id: "name",
      header: "User",
      sortKey: "name",
      cell: (user) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={user.name} email={user.email} />
          <div className="min-w-0">
            <Link
              href={`/admin/users/${user.id}`}
              className="block truncate rounded-md font-medium hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-ring"
            >
              {user.name ?? "Unnamed"}
              {user.id === currentUserId ? (
                <Badge variant="secondary" className="ml-2 align-middle">
                  You
                </Badge>
              ) : null}
            </Link>
            <span className="block truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortKey: "status",
      hideBelow: "sm",
      cell: (u) => <UserStatusBadge status={u.status} />,
    },
    {
      id: "lastLoginAt",
      header: "Last sign-in",
      sortKey: "lastLoginAt",
      hideBelow: "md",
      cell: (user) =>
        user.lastLoginAt ? (
          <time
            dateTime={user.lastLoginAt}
            title={formatDateTime(user.lastLoginAt)}
            className="text-muted-foreground"
          >
            {formatRelative(user.lastLoginAt)}
          </time>
        ) : (
          <span className="text-muted-foreground">Never</span>
        ),
    },
    {
      id: "createdAt",
      header: "Created",
      sortKey: "createdAt",
      hideBelow: "lg",
      cell: (user) => (
        <time dateTime={user.createdAt} className="text-muted-foreground">
          {formatDateTime(user.createdAt)}
        </time>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      cell: (user) => (
        <UserRowActions user={user} isSelf={user.id === currentUserId} />
      ),
    },
  ];
}

export function UsersTable({
  data,
  params,
  searchParams,
  currentUserId,
}: {
  data: Paginated<UserDTO>;
  params: UserListParams;
  searchParams: SearchParamsInput;
  currentUserId: string;
}) {
  const filtered = Boolean(params.q || params.status);
  return (
    <Card>
      {data.total === 0 ? (
        <EmptyState
          icon={Users}
          title={filtered ? "No users match your filters" : "No users yet"}
          description={
            filtered
              ? "Try a different search or clear the filters."
              : "Add the first user to get started."
          }
          action={
            filtered ? (
              <ButtonLink href={PATH} variant="outline">
                Clear filters
              </ButtonLink>
            ) : (
              <AddUserButton />
            )
          }
        />
      ) : (
        <>
          <DataTable
            caption="Users"
            columns={columns(currentUserId)}
            rows={data.items}
            getRowId={(user) => user.id}
            pathname={PATH}
            searchParams={searchParams}
            sort={params.sort}
            dir={params.dir}
          />
          <Pagination
            pathname={PATH}
            searchParams={searchParams}
            page={data.page}
            perPage={data.perPage}
            total={data.total}
            pageCount={data.pageCount}
          />
        </>
      )}
    </Card>
  );
}
