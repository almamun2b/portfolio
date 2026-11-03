import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { formatDateTime } from "@/lib/format";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { getMessageById } from "@/server/modules/messages/messages.service";
import { MessageActions } from "../_components/message-actions";
import { MessageStatusBadge } from "../_components/message-status-badge";

export const metadata: Metadata = { title: "Message" };

export default async function MessagePage({
  params,
}: PageProps<"/admin/messages/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const message = await getMessageById(id);
  if (!message) notFound();
  const subject = message.subject ?? "Your message";
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={message.subject ?? `Message from ${message.name}`}
        description={
          <>
            From {message.name} ·{" "}
            <time dateTime={message.createdAt}>
              {formatDateTime(message.createdAt)}
            </time>
          </>
        }
        actions={<MessageStatusBadge status={message.status} />}
      />
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{message.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium break-all">{message.email}</dd>
          </div>
        </dl>
        <p className="leading-relaxed whitespace-pre-wrap">{message.body}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
          >
            <Mail aria-hidden="true" /> Reply by email
          </ButtonLink>
          <ButtonLink href="/admin/messages" variant="outline">
            Back to messages
          </ButtonLink>
        </div>
      </Card>
      <MessageActions message={message} />
    </div>
  );
}
