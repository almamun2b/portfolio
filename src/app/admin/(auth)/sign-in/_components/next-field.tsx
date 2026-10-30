"use client";

import { useSearchParams } from "next/navigation";

/**
 * The hidden `next` field, filled from the URL. It is the only part of the
 * form that depends on the request, so the form itself stays in the
 * prerendered HTML. The sign-in action still validates it (`safeAdminPath`).
 */
export function NextField() {
  const next = useSearchParams().get("next") ?? "";
  return <input type="hidden" name="next" value={next} />;
}
