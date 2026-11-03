"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function ProjectError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="This project could not load" />;
}
