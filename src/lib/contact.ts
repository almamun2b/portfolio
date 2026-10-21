// Contact-form rules and helpers with no zod, so the client bundle stays
// small (audit #6). The zod `contactSchema` in schemas/contact.ts applies the
// same limits for the future Server Action.

export const CONTACT_LIMITS = {
  nameMin: 2,
  subjectMax: 120,
  bodyMin: 20,
  // A mailto: URL much over ~2,000 characters is cut off or rejected by some
  // mail apps; 1,200 characters of ordinary text stays under it once encoded.
  bodyMax: 1200,
} as const;

export interface ContactInput {
  name: string;
  email: string;
  subject?: string;
  body: string;
}
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(
  raw: Record<string, unknown>,
): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const text = (key: string) =>
    typeof raw[key] === "string" ? raw[key].trim() : "";
  const data = {
    name: text("name"),
    email: text("email"),
    subject: text("subject"),
    body: text("body"),
  };
  const errors: ContactErrors = {};
  if (data.name.length < CONTACT_LIMITS.nameMin)
    errors.name = "Enter your name (at least 2 characters).";
  if (!EMAIL.test(data.email))
    errors.email = "Enter an email address like name@example.com.";
  if (data.subject.length > CONTACT_LIMITS.subjectMax)
    errors.subject = "Keep the subject under 120 characters.";
  if (data.body.length < CONTACT_LIMITS.bodyMin)
    errors.body = "Tell me a little more: at least 20 characters.";
  else if (data.body.length > CONTACT_LIMITS.bodyMax)
    errors.body =
      "Keep the message under 1,200 characters so it fits in an email link.";
  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

function compose(input: ContactInput) {
  const custom = input.subject?.trim() ?? "";
  return {
    subject: custom !== "" ? custom : `Portfolio enquiry from ${input.name}`,
    body: `${input.body}\n\n—\n${input.name}\n${input.email}`,
  };
}

// URLSearchParams encodes spaces as "+", which mail clients show literally.
const encode = (params: Record<string, string>) =>
  new URLSearchParams(params).toString().replace(/\+/g, "%20");

/** A mailto: URL with the message pre-filled, signed with the sender's details. */
export function composeMailto(to: string, input: ContactInput) {
  const { subject, body } = compose(input);
  return `mailto:${to}?${encode({ subject, body })}`;
}

/** Compose links for visitors whose browser has no mail app configured. */
export function composeWebmail(to: string, input: ContactInput) {
  const { subject, body } = compose(input);
  return {
    gmail: `https://mail.google.com/mail/?${encode({ view: "cm", fs: "1", to, su: subject, body })}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?${encode({ to, subject, body })}`,
  };
}
