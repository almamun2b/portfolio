"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";

/**
 * Shown after "Send message" opens a mailto: link. Whether a mail app opened
 * can't be detected, so this never claims success: it offers webmail compose
 * links and the address to copy for visitors without a mail app.
 */
export function MailFallback({
  to,
  gmail,
  outlook,
}: {
  to: string;
  gmail: string;
  outlook: string;
}) {
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

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted p-5 text-sm">
      <p className="text-foreground">
        Your mail app should open with the message ready to send. Nothing
        opened? Send it from your webmail, or copy my address:
      </p>
      <div className="flex flex-wrap gap-2">
        <a href={gmail} target="_blank" rel="noreferrer" className={link}>
          Open in Gmail <ExternalLink aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a href={outlook} target="_blank" rel="noreferrer" className={link}>
          Open in Outlook <ExternalLink aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <button type="button" onClick={copy} className={link}>
          {copied === "ok" ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          Copy {to}
        </button>
      </div>
      <p role="status" className="min-h-5 text-muted-foreground">
        {copied === "ok" ? "Email address copied." : null}
        {copied === "failed" ? `Couldn't copy. The address is ${to}.` : null}
      </p>
    </div>
  );
}
