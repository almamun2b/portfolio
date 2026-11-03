"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";

/**
 * Secondary routes for visitors who would rather use their own email: open a
 * compose window in Gmail or Outlook, or copy the address.
 */
export function MailFallback({ to }: { to: string }) {
  const [copied, setCopied] = useState<"ok" | "failed" | null>(null);
  const copy = () => {
    navigator.clipboard.writeText(to).then(
      () => {
        setCopied("ok");
      },
      () => {
        setCopied("failed");
      },
    );
  };
  const link = buttonVariants({ variant: "outline", size: "sm" });
  const recipient = encodeURIComponent(to);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted p-5 text-sm">
      <p className="text-foreground">Prefer your own email? Write to {to}:</p>
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${to}`} className={link}>
          Open mail app
        </a>
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}`}
          target="_blank"
          rel="noreferrer"
          className={link}
        >
          Gmail <ExternalLink aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a
          href={`https://outlook.office.com/mail/deeplink/compose?to=${recipient}`}
          target="_blank"
          rel="noreferrer"
          className={link}
        >
          Outlook <ExternalLink aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <button type="button" onClick={copy} className={link}>
          {copied === "ok" ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          Copy address
        </button>
      </div>
      <p role="status" className="min-h-5 text-muted-foreground">
        {copied === "ok" ? "Email address copied." : null}
        {copied === "failed" ? `Couldn't copy. The address is ${to}.` : null}
      </p>
    </div>
  );
}
