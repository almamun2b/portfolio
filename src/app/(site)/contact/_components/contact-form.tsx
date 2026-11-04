"use client";

import { CircleCheck, Send } from "lucide-react";
import { useState } from "react";
import { ActionForm } from "@/components/forms/action-form";
import { TextField, TextareaField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { submitContactAction } from "@/server/modules/messages/messages.actions";
import { MailFallback } from "./mail-fallback";

const BODY_MAX = 4000;

/**
 * Stores the message through a Server Action (zod-validated, rate limited,
 * honeypot-checked) and shows a confirmation. It works without JS (the form
 * posts to the action). The email links underneath stay for anyone who would
 * rather write from their own mail app.
 */
export function ContactForm({ to }: { to: string }) {
  const [sent, setSent] = useState(false);
  const [length, setLength] = useState(0);

  if (sent) {
    return (
      <div className="flex flex-col gap-6">
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-success/40 bg-success/10 p-5"
        >
          <CircleCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-success"
          />
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">Message sent.</p>
            <p className="text-sm text-muted-foreground">
              Thanks for writing. I read every message and reply by email.
            </p>
          </div>
        </div>
        <MailFallback to={to} />
      </div>
    );
  }

  return (
    <ActionForm
      action={submitContactAction}
      onSuccess={() => {
        setSent(true);
      }}
      className="flex flex-col gap-5"
      aria-label="Contact form"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField name="name" label="Your name" autoComplete="name" required />
        <TextField
          name="email"
          label="Your email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
        />
      </div>
      <TextField
        name="subject"
        label="Subject"
        hint="Optional. A role title or project name helps."
        autoComplete="off"
      />
      <TextareaField
        name="body"
        label="Message"
        required
        rows={6}
        maxLength={BODY_MAX}
        hint={`${String(length)} / ${String(BODY_MAX)} characters`}
        onInput={(event) => {
          setLength(event.currentTarget.value.length);
        }}
        placeholder="What are you building, and where could I help?"
      />
      {/* Honeypot: people never see or fill it; bots usually do. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-sm text-muted-foreground">
          Your message is sent to me directly and I reply by email.
        </p>
        <SubmitButton
          size="lg"
          className="w-full sm:w-auto"
          pendingLabel="Sending"
        >
          <Send aria-hidden="true" /> Send message
        </SubmitButton>
      </div>
      <MailFallback to={to} />
    </ActionForm>
  );
}
