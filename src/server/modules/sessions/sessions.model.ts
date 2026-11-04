import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { SessionDTO } from "@/lib/dto";

export const sessionSelect = {
  id: true,
  ip: true,
  userAgent: true,
  createdAt: true,
  lastSeenAt: true,
  expiresAt: true,
} satisfies Prisma.SessionSelect;

type SessionRow = Prisma.SessionGetPayload<{ select: typeof sessionSelect }>;

/** `current` is filled in per request by the service (it depends on the cookie). */
export function toSessionDTO(row: SessionRow): Omit<SessionDTO, "current"> {
  return {
    id: row.id,
    ip: row.ip,
    userAgent: row.userAgent,
    createdAt: row.createdAt.toISOString(),
    lastSeenAt: row.lastSeenAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
  };
}
