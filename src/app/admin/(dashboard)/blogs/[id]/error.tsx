"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function PostError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="This post could not load" />;
}
