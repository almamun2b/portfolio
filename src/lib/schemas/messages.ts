import { z } from "zod";
import {
  emailSchema,
  idSchema,
  listBase,
  sortByParam,
  sortOrder,
} from "./common";
import { optionalText } from "./form-helpers";

export const MESSAGE_STATUSES = ["NEW", "READ", "ARCHIVED"] as const;
export const MESSAGE_SORT_KEYS = ["createdAt", "name", "status"] as const;

export const messageListParamsSchema = z.object({
  ...listBase,
  status: z.enum(MESSAGE_STATUSES).optional().catch(undefined),
  sortBy: sortByParam(MESSAGE_SORT_KEYS, "createdAt"),
  sortOrder,
});
export type MessageListParams = z.output<typeof messageListParamsSchema>;

/** What the public contact form submits. `website` is the honeypot: real people leave it empty. */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: emailSchema,
  subject: optionalText(z.string().trim().max(120)),
  body: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters.")
    .max(4000, "Keep the message under 4000 characters."),
  website: z.string().max(0).optional().default(""),
});
export type ContactMessageInput = z.input<typeof contactMessageSchema>;

export const messageIdSchema = z.object({ id: idSchema });
export const setMessageStatusBodySchema = z.object({
  status: z.enum(MESSAGE_STATUSES),
});
export const setMessageStatusSchema = setMessageStatusBodySchema.extend({
  id: idSchema,
});
