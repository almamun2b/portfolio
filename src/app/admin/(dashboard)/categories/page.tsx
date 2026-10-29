import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";
import { requireAdmin } from "@/server/modules/auth/auth.guard";

export const metadata: Metadata = { title: "Categories" };

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
