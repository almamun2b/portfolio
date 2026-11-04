"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function ProjectsError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="Projects could not load" />;
}
