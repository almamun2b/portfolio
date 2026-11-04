"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

interface Tool {
  label: string;
  icon: LucideIcon;
  run: (editor: Editor) => void;
  active?: (editor: Editor) => boolean;
}

function askUrl(message: string): string | null {
  const value = window.prompt(message, "https://");
  return value?.trim() ? value.trim() : null;
}

const GROUPS: Tool[][] = [
  [
    {
      label: "Heading 2",
      icon: Heading2,
      run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
      active: (e) => e.isActive("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      icon: Heading3,
      run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
      active: (e) => e.isActive("heading", { level: 3 }),
    },
  ],
  [
    {
      label: "Bold",
      icon: Bold,
      run: (e) => e.chain().focus().toggleBold().run(),
      active: (e) => e.isActive("bold"),
    },
    {
      label: "Italic",
      icon: Italic,
      run: (e) => e.chain().focus().toggleItalic().run(),
      active: (e) => e.isActive("italic"),
    },
    {
      label: "Underline",
      icon: Underline,
      run: (e) => e.chain().focus().toggleUnderline().run(),
      active: (e) => e.isActive("underline"),
    },
    {
      label: "Strikethrough",
      icon: Strikethrough,
      run: (e) => e.chain().focus().toggleStrike().run(),
      active: (e) => e.isActive("strike"),
    },
    {
      label: "Inline code",
      icon: Code,
      run: (e) => e.chain().focus().toggleCode().run(),
      active: (e) => e.isActive("code"),
    },
  ],
  [
    {
      label: "Bulleted list",
      icon: List,
      run: (e) => e.chain().focus().toggleBulletList().run(),
      active: (e) => e.isActive("bulletList"),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      run: (e) => e.chain().focus().toggleOrderedList().run(),
      active: (e) => e.isActive("orderedList"),
    },
    {
      label: "Quote",
      icon: Quote,
      run: (e) => e.chain().focus().toggleBlockquote().run(),
      active: (e) => e.isActive("blockquote"),
    },
    {
      label: "Divider",
      icon: Minus,
      run: (e) => e.chain().focus().setHorizontalRule().run(),
    },
  ],
  [
    {
      label: "Link",
      icon: Link2,
      active: (e) => e.isActive("link"),
      run: (e) => {
        if (e.isActive("link")) {
          e.chain().focus().unsetLink().run();
          return;
        }
        const href = askUrl("Link address (https://…)");
        if (href) e.chain().focus().setLink({ href }).run();
      },
    },
    {
      label: "Image from URL",
      icon: ImageIcon,
      run: (e) => {
        const src = askUrl("Image address (https://…)");
        if (!src) return;
        const alt = window.prompt("Describe the image for screen readers", "");
        e.chain()
          .focus()
          .setImage({ src, alt: alt?.trim() ?? "" })
          .run();
      },
    },
  ],
  [
    {
      label: "Undo",
      icon: Undo2,
      run: (e) => e.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      icon: Redo2,
      run: (e) => e.chain().focus().redo().run(),
    },
  ],
];

/** Formatting buttons for the editor; each is a real button with a name. */
export function RichTextToolbar({ editor }: { editor: Editor }) {
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap gap-x-3 gap-y-1 border-b border-input p-1.5"
    >
      {GROUPS.map((group, index) => (
        <div key={index} className="flex gap-0.5">
          {group.map((tool) => {
            const active = tool.active?.(editor) ?? false;
            return (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={tool.active ? active : undefined}
                onClick={() => {
                  tool.run(editor);
                }}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors",
                  "hover:bg-primary/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                  active && "bg-primary/15 text-primary-strong",
                )}
              >
                <tool.icon aria-hidden="true" className="size-4" />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
