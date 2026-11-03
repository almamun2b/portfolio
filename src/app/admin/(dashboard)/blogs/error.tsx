"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function BlogsError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="Blog posts could not load" />;
}
