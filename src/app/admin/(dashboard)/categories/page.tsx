import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";
import { requireAdmin } from "@/server/modules/auth/auth.guard";

export const metadata: Metadata = { title: "Categories" };

// Blocking on purpose: a click keeps the current page until this one is
// ready (see AGENTS.md › Navigation), so there is no skeleton to validate.
export const instant = false;

export default async function CategoriesPage() {
  await requireAdmin();
  return (
    <ComingSoon
      href="/admin/categories"
      planned={[
        "Shared by projects and blogs",
        "Slugs and colors",
        "Merge and rename",
        "Usage counts",
      ]}
    />
  );
}
