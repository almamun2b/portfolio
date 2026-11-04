import type { Metadata } from "next";
import { SessionList } from "@/components/admin/session-list";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listUserSessions } from "@/server/modules/sessions/sessions.service";
import { ChangePasswordForm } from "./_components/change-password-form";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const admin = await requireAdmin();
  const sessions = await listUserSessions(admin.id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Account"
        description="Your profile, password, and the devices you are signed in on."
      />
      <Card>
        <CardContent className="flex items-center gap-4 pt-6 sm:pt-7">
          <Avatar name={admin.name} email={admin.email} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">
              {admin.name ?? "Admin"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {admin.email}
            </p>
          </div>
          <Badge className="ml-auto">Admin</Badge>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Changing it signs out every other device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Your sessions</CardTitle>
            <CardDescription>
              Sessions end after 12 hours, or 60 minutes without activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionList sessions={sessions} userId={admin.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
