"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function MessagesError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="Messages could not load" />;
}
