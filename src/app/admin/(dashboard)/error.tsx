"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function DashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} />;
}
