import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listAllCategories } from "@/server/modules/categories/categories.service";
import { PostForm } from "../_components/post-form";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await listAllCategories();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New post"
        description="Save it as a draft, preview your edits here, then publish."
      />
      <PostForm
        categories={categories.map((c) => ({ value: c.id, label: c.name }))}
      />
    </div>
  );
}
