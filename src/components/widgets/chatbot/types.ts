// Shared shape for the chat widget. The future RAG endpoint (/api/chat)
// should accept `{ messages: ChatMessage[] }` and stream the assistant reply.
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatContact {
  email: string;
  whatsappHref: string;
}
