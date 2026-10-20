"use client";

import { CircleCheck, Send } from "lucide-react";
import { useRef, useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, fieldIds } from "@/components/ui/field";
import {
  composeMailto,
  contactSchema,
  type ContactField,
} from "@/lib/schemas/contact";

type Errors = Partial<Record<ContactField, string>>;

/**
 * Works without JS: the form submits to `mailto:` with `subject` and `body`
 * fields, which mail apps understand. With JS it validates first and builds a
 * signed message. When the backend lands, swap `onSubmit` for a Server Action
 * (useActionState) that validates with the same schema and stores it.
 */
export function ContactForm({ to }: { to: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as ContactField;
        next[key] ??= issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first)
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${first}"]`)
          ?.focus();
      return;
    }
    setErrors({});
    window.location.href = composeMailto(to, result.data);
    setSentTo(to);
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
      <Field id="body" label="Message" required error={errors.body}>
        <Textarea
          name="body"
          required
          rows={6}
          placeholder="What are you building, and where could I help?"
          {...fieldIds("body", { error: errors.body })}
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
      <p role="status" className="min-h-6 text-sm">
        {sentTo ? (
          <span className="inline-flex items-start gap-2 text-success">
            <CircleCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            Your email app should now be open with the message ready. If it
            didn&apos;t open, write to {sentTo} directly.
          </span>
        ) : null}
      </p>
    </form>
  );
}
