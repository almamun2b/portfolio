"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfirmAction } from "@/components/forms/use-confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { SessionDTO } from "@/lib/dto";
import {
  describeUserAgent,
  formatDateTime,
  formatRelative,
} from "@/lib/format";
import {
  revokeAllSessionsAction,
  revokeSessionAction,
} from "@/server/actions/users";
import { useState } from "react";

function Row({ session }: { session: SessionDTO }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const revoke = useConfirmAction({
    run: () => revokeSessionAction(null, { sessionId: session.id }),
    successMessage: "Session revoked.",
    onDone: () => {
      setOpen(false);
      router.refresh();
    },
  });
  const mobile = /iPhone|Android|Mobile/.test(session.userAgent ?? "");
  const Icon = mobile ? Smartphone : Monitor;

  return (
    <li className="flex items-center gap-4 py-3">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border-strong bg-muted text-primary-strong"
      >
        <Icon className="size-[1.1rem]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {describeUserAgent(session.userAgent)}
          {session.current ? (
            <Badge variant="success">This device</Badge>
          ) : null}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {session.ip ?? "Unknown IP"} · active{" "}
          <time
            dateTime={session.lastSeenAt}
            title={formatDateTime(session.lastSeenAt)}
          >
            {formatRelative(session.lastSeenAt)}
          </time>
        </p>
      </div>
      {session.current ? null : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            Revoke
          </Button>
          <ConfirmDialog
            open={open}
            onOpenChange={(next) => {
              if (!next) revoke.clearError();
              setOpen(next);
            }}
            title="Revoke this session?"
            description={`${describeUserAgent(session.userAgent)} will be signed out immediately.`}
            confirmLabel="Revoke session"
            tone="danger"
            pending={revoke.pending}
            error={revoke.error}
            onConfirm={revoke.confirm}
          />
        </>
      )}
    </li>
  );
}

/** Active sessions of one user, with revoke buttons and "sign out everywhere". */
export function SessionList({
  sessions,
  userId,
}: {
  sessions: SessionDTO[];
  userId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const revokeAll = useConfirmAction({
    run: () => revokeAllSessionsAction(null, { id: userId }),
    successMessage: "Signed out everywhere.",
    onDone: () => {
      setOpen(false);
      router.refresh();
    },
  });
  const others = sessions.filter((s) => !s.current).length;

  if (sessions.length === 0) {
    return (
      <EmptyState icon={Monitor} title="No active sessions" className="py-10" />
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-border">
        {sessions.map((session) => (
          <Row key={session.id} session={session} />
        ))}
      </ul>
      {others > 0 ? (
        <div className="pt-2">
          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            Sign out{" "}
            {sessions.some((s) => s.current) ? "other devices" : "everywhere"}
          </Button>
          <ConfirmDialog
            open={open}
            onOpenChange={(next) => {
              if (!next) revokeAll.clearError();
              setOpen(next);
            }}
            title="Sign out all other sessions?"
            description={`${String(others)} ${others === 1 ? "session is" : "sessions are"} ended immediately.`}
            confirmLabel="Sign out"
            tone="danger"
            pending={revokeAll.pending}
            error={revokeAll.error}
            onConfirm={revokeAll.confirm}
          />
        </div>
      ) : null}
    </div>
  );
}
