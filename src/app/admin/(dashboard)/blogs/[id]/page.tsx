import { ExternalLink } from "lucide-react";
import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listAllCategories } from "@/server/modules/categories/categories.service";
import { getPostById } from "@/server/modules/posts/posts.service";
import { PostForm } from "../_components/post-form";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({
  params,
}: PageProps<"/admin/blogs/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPostById(id),
    listAllCategories(),
  ]);
  if (!post) notFound();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={post.title}
        description={`/blog/${post.slug} · ${String(post.readingMinutes)} min read`}
        actions={
          post.status === "PUBLISHED" ? (
            <ButtonLink href={`/blog/${post.slug}` as Route} variant="outline">
              <ExternalLink aria-hidden="true" /> View on site
            </ButtonLink>
          ) : undefined
        }
      />
      <PostForm
        post={post}
        categories={categories.map((c) => ({ value: c.id, label: c.name }))}
      />
    </div>
  );
}
