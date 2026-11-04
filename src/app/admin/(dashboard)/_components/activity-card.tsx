import { Activity } from "lucide-react";
import Link from "next/link";
import { AuditList } from "@/components/admin/audit-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auditListParamsSchema } from "@/lib/schemas/audit";
import { listAuditLogs } from "@/server/modules/audit/audit.service";

/** The newest audit events; refreshed by the `audit` tag after any mutation. */
export async function ActivityCard() {
  const activity = await listAuditLogs({
    ...auditListParamsSchema.parse({}),
    limit: 6,
  });
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity
            aria-hidden="true"
            className="size-[1.1rem] text-primary-strong"
          />
          Recent activity
        </CardTitle>
        <Link
          href="/admin/audit-log"
          className="rounded-md text-sm text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <AuditList items={activity.data} />
      </CardContent>
    </Card>
  );
}
