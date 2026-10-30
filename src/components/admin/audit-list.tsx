import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { auditLabel } from "@/lib/audit-labels";
import type { AuditLogDTO } from "@/lib/dto";
import { formatDateTime, formatRelative } from "@/lib/format";

/** Compact activity feed (dashboard, user detail). */
export function AuditList({
  items,
  emptyText = "No activity yet.",
}: {
  items: AuditLogDTO[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <EmptyState icon={Activity} title={emptyText} className="py-10" />;
  }
  return (
    <ol className="flex flex-col divide-y divide-border">
      {items.map((log) => (
        <li
          key={log.id}
          className="flex items-start justify-between gap-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">{auditLabel(log.action)}</p>
            <p className="truncate text-xs text-muted-foreground">
              {log.actor
                ? (log.actor.name ?? log.actor.email)
                : "Unknown visitor"}
              {typeof log.metadata?.email === "string"
                ? ` · ${log.metadata.email}`
                : ""}
            </p>
          </div>
          <time
            dateTime={log.createdAt}
            title={formatDateTime(log.createdAt)}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {formatRelative(log.createdAt)}
          </time>
        </li>
      ))}
    </ol>
  );
}
