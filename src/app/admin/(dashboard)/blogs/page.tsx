import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";
import { requireAdmin } from "@/server/modules/auth/auth.guard";

export const metadata: Metadata = { title: "Blogs" };

export default async function BlogsPage() {
  await requireAdmin();
  return (
    <ComingSoon
      href="/admin/blogs"
      planned={[
        "Markdown editor",
        "Cover images and slugs",
        "Scheduled publishing",
        "SEO fields per post",
      ]}
    />
  );
}
