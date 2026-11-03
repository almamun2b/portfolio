import "server-only";
import {
  contactMessageSchema,
  messageIdSchema,
  messageListParamsSchema,
  setMessageStatusBodySchema,
} from "@/lib/schemas/messages";
import { AppError } from "@/server/core/errors/app-error";
import { apiRoute } from "@/server/core/http/route";
import { messageTags } from "./messages.constants";
import {
  deleteMessage,
  getMessageById,
  listMessages,
  setMessageStatus,
  submitContactMessage,
} from "./messages.service";

/** Public JSON endpoint for the same flow as the contact form (same-origin only, like every write). */
export const submitMessageRoute = apiRoute(
  {
    name: "messages.submit",
    auth: "public",
    body: contactMessageSchema,
    status: 201,
    message: "Message received.",
    tags: () => messageTags.submit(),
  },
  async ({ body }) => {
    await submitContactMessage(body);
    return null;
  },
);

export const listMessagesRoute = apiRoute(
  { name: "messages.list", auth: "admin", query: messageListParamsSchema },
  ({ query }) => listMessages(query),
);

export const getMessageRoute = apiRoute(
  { name: "messages.get", auth: "admin", params: messageIdSchema },
  async ({ params }) => {
    const message = await getMessageById(params.id);
    if (!message) throw AppError.notFound("That message no longer exists.");
    return message;
  },
);

export const setMessageStatusRoute = apiRoute(
  {
    name: "messages.setStatus",
    auth: "admin",
    params: messageIdSchema,
    body: setMessageStatusBodySchema,
    message: "Status updated.",
    tags: ({ params }) => messageTags.setStatus(params),
  },
  ({ params, body }) => setMessageStatus(params.id, body.status),
);

export const deleteMessageRoute = apiRoute(
  {
    name: "messages.delete",
    auth: "admin",
    params: messageIdSchema,
    message: "Message deleted.",
    tags: ({ params }) => messageTags.remove(params),
  },
  async ({ params }) => {
    await deleteMessage(params.id);
    return null;
  },
);
