import { z } from "zod";

// Shared by the contact form today (client-side, composes an email) and by
// the Server Action that will store messages once the backend exists.
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name (at least 2 characters)."),
  email: z.email("Enter an email address like name@example.com."),
  subject: z
    .string()
    .trim()
    .max(120, "Keep the subject under 120 characters.")
    .optional(),
  body: z
    .string()
    .trim()
    .min(20, "Tell me a little more: at least 20 characters.")
    .max(4000, "Keep the message under 4,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** A mailto: URL with the message pre-filled, signed with the sender's details. */
export function composeMailto(to: string, input: ContactInput) {
  const custom = input.subject?.trim() ?? "";
  const subject =
    custom !== "" ? custom : `Portfolio enquiry from ${input.name}`;
  const body = `${input.body}\n\n—\n${input.name}\n${input.email}`;
  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}
