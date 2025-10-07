"use client";

import "quill/dist/quill.snow.css";
import React from "react";
import { useQuill } from "react-quilljs";

// Register custom font sizes
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
}) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder,
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
      ],
    },
  });

  // Set initial content only once
  const isInitializedRef = React.useRef(false);
  React.useEffect(() => {
    if (quill && defaultValue && !isInitializedRef.current) {
      // ✅ FIXED: convert requires an object, not a plain string
      const delta = quill.clipboard.convert({ html: defaultValue });
      quill.setContents(delta, "silent");
      isInitializedRef.current = true;
    }
  }, [quill, defaultValue]);

  // Handle content change with cleanup
  React.useEffect(() => {
    if (!quill || !onChange) return;

    const handleChange = () => {
      onChange(quill.root.innerHTML);
    };

    quill.on("text-change", handleChange);
    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill, onChange]);

  return (
    <div className="bg-background border border-border rounded-lg">
      <div ref={quillRef} className="min-h-[300px] h-[300px] max-h-[300px]" />
    </div>
  );
};

export default RichTextEditor;
