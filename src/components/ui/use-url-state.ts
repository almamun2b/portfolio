"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

/**
 * Updates the page's query string (filters, search) with a soft navigation.
 * Changing anything but `page` drops `page`, so a new filter starts on page 1.
 * `pending` is true while the server renders the new view.
 */
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(current.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!("page" in patch)) next.delete("page");
    const query = next.toString();
    startTransition(() => {
      router.replace((query ? `${pathname}?${query}` : pathname) as Route, {
        scroll: false,
      });
    });
  }

  return { update, pending, current };
}
