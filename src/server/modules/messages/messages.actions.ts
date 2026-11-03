"use server";

import {
  contactMessageSchema,
  messageIdSchema,
  setMessageStatusSchema,
} from "@/lib/schemas/messages";
import { adminAction, publicAction } from "@/server/core/action";
import { messageTags } from "./messages.constants";
import {
  deleteMessage,
  setMessageStatus,
  submitContactMessage,
} from "./messages.service";

/** The public contact form. Validated, rate limited, and honeypot-checked in the service. */
export const submitContactAction = publicAction(
  "contact.submit",
  contactMessageSchema,
  async (data) => {
    await submitContactMessage(data);
  },
  { tags: messageTags.submit },
);

export const setMessageStatusAction = adminAction(
  "message.setStatus",
  setMessageStatusSchema,
  async (data) => {
    await setMessageStatus(data.id, data.status);
  },
  { tags: messageTags.setStatus },
);

export const deleteMessageAction = adminAction(
  "message.delete",
  messageIdSchema,
  async (data) => {
    await deleteMessage(data.id);
  },
  { tags: messageTags.remove },
);
