"use client";

import { Bot } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/ui/dialog";
import { WidgetTip } from "../whatsapp-button";
import { ChatPanel } from "./chat-panel";
import type { ChatContact } from "./types";

/** Floating button that opens the (placeholder) portfolio assistant. */
export function ChatbotLauncher({ contact }: { contact: ChatContact }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Ask my portfolio assistant"
        className="group relative grid size-14 cursor-pointer place-items-center rounded-full bg-gradient-button text-primary-foreground shadow-button transition-[scale,box-shadow] duration-300 ease-spring hover:scale-110 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:scale-100"
      >
        <Bot aria-hidden="true" className="size-6" />
        <WidgetTip>Ask my assistant</WidgetTip>
      </button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Ask about my work"
        description="Portfolio assistant · preview"
        panelClassName="bg-popover/95 backdrop-blur-xl"
      >
        {open ? <ChatPanel contact={contact} /> : null}
      </Sheet>
    </>
  );
}
