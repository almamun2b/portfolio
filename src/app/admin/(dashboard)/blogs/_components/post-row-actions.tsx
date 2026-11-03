"use client";

import { Ellipsis, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useConfirmAction } from "@/components/forms/use-confirm-action";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dropdown, DropdownItem, DropdownLink } from "@/components/ui/dropdown";
import type { PostDTO } from "@/lib/dto";
import { deletePostAction } from "@/server/modules/posts/posts.actions";

export function PostRowActions({ post }: { post: PostDTO }) {
  const [confirming, setConfirming] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const remove = useConfirmAction({
    run: () => deletePostAction(null, { id: post.id }),
    successMessage: "Post deleted.",
    onDone: () => {
      setConfirming(false);
      router.refresh();
    },
  });

  return (
    <>
      <Dropdown
        label={`Actions for ${post.title}`}
        triggerRef={trigger}
        trigger={<Ellipsis aria-hidden="true" className="size-[1.1rem]" />}
      >
        <DropdownLink
          href={`/admin/blogs/${post.id}`}
          icon={<Pencil aria-hidden="true" />}
        >
          Edit
        </DropdownLink>
        {post.status === "PUBLISHED" ? (
          <DropdownLink
            href={`/blog/${post.slug}` as Route}
            icon={<ExternalLink aria-hidden="true" />}
          >
            View on site
          </DropdownLink>
        ) : null}
        <DropdownItem
          icon={<Trash2 aria-hidden="true" />}
          onSelect={() => {
            setConfirming(true);
          }}
          className="text-error [&_svg]:text-error"
        >
          Delete
        </DropdownItem>
      </Dropdown>
      <ConfirmDialog
        open={confirming}
        onOpenChange={(open) => {
          if (!open) {
            remove.clearError();
            setConfirming(false);
            trigger.current?.focus();
          }
        }}
        title={`Delete "${post.title}"?`}
        description="This removes the post for good. It can't be undone."
        confirmLabel="Delete post"
        tone="danger"
        confirmPhrase={post.slug}
        pending={remove.pending}
        error={remove.error}
        onConfirm={remove.confirm}
      />
    </>
  );
}
