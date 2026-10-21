"use client";

import { Send } from "lucide-react";
import { useRef, useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, fieldIds } from "@/components/ui/field";
import {
  CONTACT_LIMITS,
  composeMailto,
  composeWebmail,
  validateContact,
  type ContactErrors,
} from "@/lib/contact";
import { MailFallback } from "./mail-fallback";

/**
 * Works without JS: the form submits to `mailto:` with `subject` and `body`
 * fields, which mail apps understand (the sender's name and address come
 * from their own mail account). With JS it validates first, builds a signed
 * message, and then offers webmail links, because whether a mail app opened
 * can't be detected. When the backend lands, swap `onSubmit` for a Server
 * Action (useActionState) that validates with `contactSchema` and stores it.
 */
export function ContactForm({ to }: { to: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [length, setLength] = useState(0);
  const [webmail, setWebmail] = useState<ReturnType<
    typeof composeWebmail
  > | null>(null);

  const onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (event) => {
    event.preventDefault();
    const result = validateContact(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    if (!result.ok) {
      setErrors(result.errors);
      const first = Object.keys(result.errors)[0];
      if (first)
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${first}"]`)
          ?.focus();
      return;
    }
    setErrors({});
    window.location.href = composeMailto(to, result.data);
    setWebmail(composeWebmail(to, result.data));
  };

  return (
    <form
      ref={formRef}
      action={`mailto:${to}`}
      method="get"
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-5"
      aria-describedby="contact-note"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" required error={errors.name}>
          <Input
            name="name"
            autoComplete="name"
            required
            {...fieldIds("name", { error: errors.name })}
          />
        </Field>
        <Field id="email" label="Your email" required error={errors.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            {...fieldIds("email", { error: errors.email })}
          />
        </Field>
      </div>
      <Field
        id="subject"
        label="Subject"
        hint="Optional. A role title or project name helps."
        error={errors.subject}
      >
        <Input
          name="subject"
          autoComplete="off"
          {...fieldIds("subject", { hint: true, error: errors.subject })}
        />
      </Field>
      <Field
        id="body"
        label="Message"
        required
        hint={`${String(length)} / ${String(CONTACT_LIMITS.bodyMax)} characters`}
        error={errors.body}
      >
        <Textarea
          name="body"
          required
          rows={6}
          maxLength={CONTACT_LIMITS.bodyMax}
          onInput={(event) => {
            setLength(event.currentTarget.value.length);
          }}
          placeholder="What are you building, and where could I help?"
          {...fieldIds("body", { hint: true, error: errors.body })}
        />
      </Field>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-note" className="max-w-sm text-sm text-muted-foreground">
          Sending opens your email app with the message ready. Nothing is stored
          on this site.
        </p>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Send aria-hidden="true" /> Send message
        </Button>
      </div>
      {webmail ? <MailFallback to={to} {...webmail} /> : null}
    </form>
  );
}
