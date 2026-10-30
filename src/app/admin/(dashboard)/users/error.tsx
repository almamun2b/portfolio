"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function UsersError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="Users could not load" />;
}
