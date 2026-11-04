"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { CheckboxGroupField } from "@/components/forms/checkbox-group-field";
import { ActionForm } from "@/components/forms/action-form";
import {
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/form-fields";
import { RichTextField } from "@/components/forms/rich-text-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import type { PostDTO } from "@/lib/dto";
import {
  createPostAction,
  updatePostAction,
} from "@/server/modules/posts/posts.actions";

/** Create (no `post`) or edit one blog post. */
export function PostForm({
  post,
  categories,
}: {
  post?: PostDTO;
  categories: { value: string; label: string }[];
}) {
  const router = useRouter();
  return (
    <ActionForm
      action={post ? updatePostAction : createPostAction}
      successMessage={post ? "Post saved." : "Post created."}
      onSuccess={(data) => {
        if (post) router.refresh();
        else router.replace(`/admin/blogs/${data.id}`);
      }}
      className="flex flex-col gap-6"
      aria-label={post ? "Edit post" : "New post"}
    >
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <TextField
          name="title"
          label="Title"
          defaultValue={post?.title ?? ""}
          required
        />
        <TextField
          name="slug"
          label="Slug"
          hint="The post lives at /blog/<slug>. Lowercase letters, numbers, and dashes."
          defaultValue={post?.slug ?? ""}
          autoComplete="off"
          required
        />
        <TextareaField
          name="excerpt"
          label="Summary"
          hint="Shown on the blog list and in search results (up to 320 characters)."
          defaultValue={post?.excerpt ?? ""}
          className="min-h-24"
          required
        />
        <RichTextField
          name="body"
          label="Post"
          hint="Headings, lists, links, quotes, code, and images by URL."
          defaultValue={post?.body ?? ""}
        />
      </Card>
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Details</h2>
        <CheckboxGroupField
          name="categoryIds"
          legend="Categories"
          hint="Optional. Manage them under Categories."
          options={categories}
          defaultValues={post?.categories.map((c) => c.id)}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            name="coverUrl"
            label="Cover image URL (optional)"
            hint="https:// or a path under /public. Without one, the post gets a designed cover."
            defaultValue={post?.coverUrl ?? ""}
          />
          <TextField
            name="coverAlt"
            label="Cover image description"
            hint="Required when there is a cover image."
            defaultValue={post?.coverAlt ?? ""}
          />
          <TextField
            name="seoTitle"
            label="SEO title (optional)"
            hint="Up to 70 characters. Defaults to the title."
            defaultValue={post?.seoTitle ?? ""}
          />
          <TextField
            name="seoDescription"
            label="SEO description (optional)"
            hint="Up to 170 characters. Defaults to the summary."
            defaultValue={post?.seoDescription ?? ""}
          />
        </div>
      </Card>
      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="w-full sm:max-w-56">
          <SelectField
            name="status"
            label="Status"
            hint="Drafts are visible only here."
            defaultValue={post?.status ?? "DRAFT"}
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
            ]}
          />
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <ButtonLink href="/admin/blogs" variant="outline">
            Back to posts
          </ButtonLink>
          <SubmitButton pendingLabel="Saving">
            <Save aria-hidden="true" /> {post ? "Save post" : "Create post"}
          </SubmitButton>
        </div>
      </Card>
    </ActionForm>
  );
}
