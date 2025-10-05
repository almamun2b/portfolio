"use client";

import "quill/dist/quill.snow.css";
import React from "react";
import { useQuill } from "react-quilljs";

interface RichTextEditorProps {
  /** Placeholder text inside the editor */
  placeholder?: string;

  /** Initial default content (HTML string) */
  defaultValue?: string;

  /** Callback fired when content changes */
  onChange?: (content: string) => void;

  /** Optional custom height */
  height?: string | number;

  /** Optional custom width */
  width?: string | number;

  /** Label above the editor (optional) */
  label?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  placeholder = "Start typing...",
  defaultValue = "",
  onChange,
  height = 300,
  width = "100%",
}) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder,
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
    },
  });

  // Set initial content
  React.useEffect(() => {
    if (quill && defaultValue) {
      quill.root.innerHTML = defaultValue;
    }
  }, [quill, defaultValue]);

  // Handle content change
  React.useEffect(() => {
    if (quill && onChange) {
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill, onChange]);

  return (
    <div
      style={{ width, height }}
      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <div ref={quillRef} style={{ height: "100%" }} />
    </div>
  );
};

export default RichTextEditor;
