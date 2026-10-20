"use client";

import { useState } from "react";
import type { ChatMessage } from "./types";

let counter = 0;
const nextId = () => `m${String((counter += 1))}`;

/**
 * Chat state for the widget. `getReply` is the integration seam: today it
 * returns the placeholder; when the RAG backend exists, replace it with a
 * call to /api/chat (streaming) and keep this hook's API unchanged.
 */
export function useChat({
  greeting,
  getReply,
}: {
  greeting: string;
  getReply: (question: string, history: ChatMessage[]) => Promise<string>;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "greeting", role: "assistant", content: greeting },
  ]);
  const [pending, setPending] = useState(false);
  const send = async (text: string) => {
    const content = text.trim();
    if (!content || pending) return;
    const question: ChatMessage = { id: nextId(), role: "user", content };
    setMessages((current) => [...current, question]);
    setPending(true);
    try {
      const reply = await getReply(content, [...messages, question]);
      setMessages((current) => [
        ...current,
        { id: nextId(), role: "assistant", content: reply },
      ]);
    } finally {
      setPending(false);
    }
  };

  return { messages, pending, send };
}
