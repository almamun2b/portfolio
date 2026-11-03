"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function MessageError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="This message could not load" />;
}
