"use client";

import { useLinkStatus } from "next/link";

/**
 * Render inside a <Link>. While that navigation is in flight it adds a
 * `data-pending` element, which <ListRegion> turns into a dimmed table, and
 * tells screen readers something is loading. Renders nothing otherwise.
 */
export function PendingMark() {
  const { pending } = useLinkStatus();
  return pending ? (
    <span data-pending="true" role="status" className="sr-only">
      Loading
    </span>
  ) : null;
}
