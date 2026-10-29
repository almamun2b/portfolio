import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditList } from "@/components/admin/audit-list";
import { SessionList } from "@/components/admin/session-list";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { listAuditForTarget } from "@/server/modules/audit/audit.service";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listUserSessions } from "@/server/modules/sessions/sessions.service";
import { getUserById } from "@/server/modules/users/users.service";
import { UserRowActions } from "../_components/user-row-actions";
import { UserStatusBadge } from "../_components/user-status-badge";

export const metadata: Metadata = { title: "User details" };

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

const when = (iso: string | null) =>
  iso ? <time dateTime={iso}>{formatDateTime(iso)}</time> : "Never";

// Blocking on purpose: a click keeps the current page until this one is
// ready (see AGENTS.md › Navigation), so there is no skeleton to validate.
export const instant = false;

export default async function UserDetailPage({
  params,
}: PageProps<"/admin/users/[id]">) {
  const admin = await requireAdmin();
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();
  const [sessions, activity] = await Promise.all([
    listUserSessions(id),
    listAuditForTarget("user", id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={user.name} email={user.email} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {user.name ?? "Unnamed user"}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserStatusBadge status={user.status} />
          {user.id === admin.id ? <Badge variant="secondary">You</Badge> : null}
          <UserRowActions
            user={user}
            isSelf={user.id === admin.id}
            showView={false}
            afterDelete="/admin/users"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Fact label="Role">
                <Badge>Admin</Badge>
              </Fact>
              <Fact label="Status">
                <UserStatusBadge status={user.status} />
              </Fact>
              <Fact label="Last sign-in">{when(user.lastLoginAt)}</Fact>
              <Fact label="Password changed">
                {when(user.passwordChangedAt)}
              </Fact>
              <Fact label="Created">{when(user.createdAt)}</Fact>
              <Fact label="Updated">{when(user.updatedAt)}</Fact>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Active sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionList sessions={sessions} userId={user.id} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditList
            items={activity}
            emptyText="No activity recorded for this user."
          />
        </CardContent>
      </Card>
    </div>
  );
}
