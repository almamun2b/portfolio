"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useId, useState, type ReactNode } from "react";
import { Label } from "@/components/ui/field";
import { useFormState } from "./form-state";
import { RichTextToolbar } from "./rich-text-toolbar";

/**
 * The blog editor: Tiptap (open-source, MIT) with a small toolbar. The HTML
 * goes into a hidden input named `name` on every change. The server sanitizes
 * it again on save, so this editor is a convenience, not a trust boundary.
 * It needs JS; the rest of the post form still works without it.
 */
export function RichTextField({
  name,
  label,
  hint,
  defaultValue = "",
  placeholder = "Start writing…",
}: {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  defaultValue?: string;
  placeholder?: string;
}) {
  const id = useId();
  const error = useFormState().errors[name]?.[0];
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    content: defaultValue,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": `${id}-label`,
        ...(error ? { "aria-invalid": "true" } : {}),
        class:
          "rich-text min-h-72 max-w-none px-4 py-3 text-base focus-visible:outline-none",
      },
    },
    onUpdate: ({ editor: e }) => {
      setHtml(e.isEmpty ? "" : e.getHTML());
    },
  });
  // Re-render the toolbar when the selection changes (active states).
  useEditorState({
    editor,
    selector: (ctx) => ctx.editor?.state.selection,
  });

  return (
    <div className="flex flex-col gap-2">
      <Label id={`${id}-label`} htmlFor={id}>
        {label}
      </Label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <div
        className="overflow-hidden rounded-2xl border border-input bg-card transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_22%,transparent)] data-[invalid=true]:border-error"
        data-invalid={error ? "true" : undefined}
      >
        {editor ? <RichTextToolbar editor={editor} /> : null}
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} />
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
