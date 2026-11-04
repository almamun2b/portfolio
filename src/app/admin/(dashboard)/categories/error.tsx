"use client";

import { ErrorState } from "@/components/admin/error-state";

export default function CategoriesError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} title="Categories could not load" />;
}
