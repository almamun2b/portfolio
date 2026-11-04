import type { MessageDTO, Paginated } from "@/lib/dto";
import type {
  ContactMessageInput,
  MessageListParams,
} from "@/lib/schemas/messages";
import { contactMessageSchema } from "@/lib/schemas/messages";
import { writeAudit } from "@/server/core/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import { consume, minutes } from "@/server/core/rate-limit";
import { getClientIp, getUserAgent } from "@/server/core/request-context";
import { assertAdmin, requireAdmin } from "@/server/modules/auth/auth.guard";
import { cacheLife, cacheTag } from "next/cache";
import { QueryBuilder } from "query-builder-prisma";
import "server-only";
import { MESSAGE_SEARCHABLE_FIELDS } from "./messages.constants";
import { messageSelect, toMessageDTO } from "./messages.model";

const gone = () => AppError.notFound("That message no longer exists.");

// Five messages per IP per hour is plenty for a person and little for a bot.
const SUBMIT_LIMIT = 5;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

// ---- public write ----------------------------------------------------------

/**
 * Stores a contact-form submission. The honeypot (`website`) is silently
 * accepted-and-dropped so bots learn nothing; real people never fill it.
 */
export async function submitContactMessage(
  input: ContactMessageInput,
): Promise<{ stored: boolean }> {
  const data = contactMessageSchema.parse(input);
  if (data.website) return { stored: false };
  const ip = await getClientIp();
  const limit = await consume(`contact:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!limit.allowed) {
    throw AppError.rateLimited(
      `Too many messages from this connection. Try again in ${String(minutes(limit.retryAfterSec))} minutes, or email me directly.`,
    );
  }
  await db.message.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      body: data.body,
      ip,
      userAgent: await getUserAgent(),
    },
    select: { id: true },
  });
  return { stored: true };
}

// ---- admin reads -----------------------------------------------------------

export async function listMessages(
  params: MessageListParams,
): Promise<Paginated<MessageDTO>> {
  await requireAdmin();
  return listMessagesCached(params);
}

async function listMessagesCached(
  params: MessageListParams,
): Promise<Paginated<MessageDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.MESSAGES);
  cacheLife("admin");
  const { data, meta } = await new QueryBuilder(db.message)
    .search({
      searchText: params.searchTerm,
      fields: [...MESSAGE_SEARCHABLE_FIELDS],
    })
    .filter({ status: params.status })
    .orderBy([{ [params.sortBy]: params.sortOrder }, { id: "asc" }])
    .paginate({ page: params.page, limit: params.limit })
    .select(messageSelect)
    .executeWithMeta();
  return { data: data.map(toMessageDTO), meta };
}

export async function getMessageById(id: string): Promise<MessageDTO | null> {
  await requireAdmin();
  return getMessageByIdCached(id);
}

async function getMessageByIdCached(id: string): Promise<MessageDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.MESSAGES, CACHE_TAGS.message(id));
  cacheLife("admin");
  const row = await db.message.findUnique({
    where: { id },
    select: messageSelect,
  });
  return row ? toMessageDTO(row) : null;
}

// ---- admin writes ----------------------------------------------------------

export async function setMessageStatus(
  id: string,
  status: "NEW" | "READ" | "ARCHIVED",
): Promise<MessageDTO> {
  const actor = await assertAdmin();
  const before = await db.message.findUnique({
    where: { id },
    select: { status: true, email: true },
  });
  if (!before) throw gone();
  if (before.status === status) {
    const same = await db.message.findUniqueOrThrow({
      where: { id },
      select: messageSelect,
    });
    return toMessageDTO(same);
  }
  const row = await db.$transaction(async (tx) => {
    const updated = await tx.message.update({
      where: { id },
      data: { status },
      select: messageSelect,
    });
    await writeAudit(
      {
        actorId: actor.id,
        action: "message.update",
        targetType: "message",
        targetId: id,
        metadata: { from: before.status, to: status },
      },
      tx,
    );
    return updated;
  });
  return toMessageDTO(row);
}

export async function deleteMessage(id: string): Promise<void> {
  const actor = await assertAdmin();
  const target = await db.message.findUnique({
    where: { id },
    select: { email: true },
  });
  if (!target) throw gone();
  await db.$transaction(async (tx) => {
    await writeAudit(
      {
        actorId: actor.id,
        action: "message.delete",
        targetType: "message",
        targetId: id,
        metadata: { email: target.email },
      },
      tx,
    );
    await tx.message.delete({ where: { id } });
  });
}
