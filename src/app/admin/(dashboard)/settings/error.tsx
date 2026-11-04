"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function SettingsError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="Settings could not load" />;
}
