import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { MessageDTO } from "@/lib/dto";

// ip and userAgent stay in the database for abuse handling; they never leave it.
export const messageSelect = {
  id: true,
  name: true,
  email: true,
  subject: true,
  body: true,
  status: true,
  createdAt: true,
} satisfies Prisma.MessageSelect;

type MessageRow = Prisma.MessageGetPayload<{ select: typeof messageSelect }>;

export function toMessageDTO(row: MessageRow): MessageDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    body: row.body,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}
