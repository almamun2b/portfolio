"use client";

import { cn } from "@/lib/utils";

interface HtmlRendererProps {
  content: string;
  className?: string;
}

export default function HtmlRenderer({
  content,
  className,
}: HtmlRendererProps) {
  if (!content) {
    return null;
  }

  return (
    <div
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
