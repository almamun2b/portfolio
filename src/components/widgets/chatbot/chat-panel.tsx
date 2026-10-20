"use client";

import { cn } from "cn";
import { Bot, Info, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/button";
import type { ChatContact } from "./types";
import { useChat } from "./use-chat";

const SUGGESTIONS = [
  "What has Mamun built with Shopify?",
  "Which stack does he use most?",
  "Is he open to remote roles?",
];

// Placeholder until the RAG backend exists: answers point to a human.
function placeholderReply(contact: ChatContact) {
  return () =>
    new Promise<string>((resolve) =>
      setTimeout(() => {
        resolve(
          `I'm not connected yet: the AI assistant is coming soon. For now, email ${contact.email} or message on WhatsApp and Mamun will answer directly.`,
        );
      }, 600),
    );
}

/** Conversation view inside the chat sheet. */
export function ChatPanel({ contact }: { contact: ChatContact }) {
  const { messages, pending, send } = useChat({
    greeting:
      "Hi! I'm Mamun's portfolio assistant. Ask about his projects, stack, or availability.",
    getReply: placeholderReply(contact),
  });
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  const submit = (text: string) => {
    setDraft("");
    void send(text);
  };

  return (
    <div className="flex h-full flex-col gap-4" data-lenis-prevent>
      <p className="flex items-start gap-2 rounded-2xl border border-border-strong bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <Info
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-secondary-strong"
        />
        The AI assistant is coming soon. For now, email or WhatsApp me.
      </p>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              message.role === "user"
                ? "self-end rounded-br-md bg-gradient-button text-primary-foreground"
                : "self-start rounded-bl-md border border-border bg-card-solid text-foreground",
            )}
          >
            {message.role === "assistant" ? (
              <span className="sr-only">Assistant: </span>
            ) : (
              <span className="sr-only">You: </span>
            )}
            {message.content}
          </div>
        ))}
        {pending ? (
          <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-border bg-card-solid px-3.5 py-2.5 text-sm text-muted-foreground">
            <Bot aria-hidden="true" className="size-4" /> Thinking…
          </div>
        ) : null}
      </div>

      {messages.length === 1 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
          {SUGGESTIONS.map((question) => (
            <li key={question}>
              <button
                type="button"
                onClick={() => {
                  submit(question);
                }}
                className="min-h-9 rounded-full border border-border-strong bg-muted px-3 text-xs text-foreground transition-colors hover:border-primary hover:bg-primary/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
        className="flex items-center gap-2 rounded-full border border-input bg-card px-2 py-1.5 focus-within:border-primary"
      >
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>
        <input
          id="chat-input"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          placeholder="Ask about my work…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <IconButton
          label="Send"
          type="submit"
          variant="primary"
          size="icon-sm"
          disabled={pending || draft.trim() === ""}
        >
          <SendHorizontal aria-hidden="true" />
        </IconButton>
      </form>
    </div>
  );
}
