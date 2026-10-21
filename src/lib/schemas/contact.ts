import { z } from "zod";
import { CONTACT_LIMITS, type ContactInput } from "@/lib/contact";

// Server-side twin of validateContact() in lib/contact.ts, for the Server
// Action that will store messages once the backend exists. The client form
// uses the zod-free validator so zod stays out of the browser bundle.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.nameMin, "Enter your name (at least 2 characters)."),
  email: z.email("Enter an email address like name@example.com."),
  subject: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.subjectMax, "Keep the subject under 120 characters.")
    .optional(),
  body: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.bodyMin,
      "Tell me a little more: at least 20 characters.",
    )
    .max(
      CONTACT_LIMITS.bodyMax,
      "Keep the message under 1,200 characters so it fits in an email link.",
    ),
}) satisfies z.ZodType<ContactInput>;

export {
  composeMailto,
  type ContactField,
  type ContactInput,
} from "@/lib/contact";
