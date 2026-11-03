"use client";

import { Ellipsis, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useConfirmAction } from "@/components/forms/use-confirm-action";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dropdown, DropdownItem, DropdownLink } from "@/components/ui/dropdown";
import type { ProjectAdminDTO } from "@/lib/dto";
import { projectHref } from "@/lib/site";
import { deleteProjectAction } from "@/server/modules/projects/projects.actions";

export function ProjectRowActions({ project }: { project: ProjectAdminDTO }) {
  const [confirming, setConfirming] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const remove = useConfirmAction({
    run: () => deleteProjectAction(null, { id: project.id }),
    successMessage: "Project deleted.",
    onDone: () => {
      setConfirming(false);
      router.refresh();
    },
  });

  return (
    <>
      <Dropdown
        label={`Actions for ${project.title}`}
        triggerRef={trigger}
        trigger={<Ellipsis aria-hidden="true" className="size-[1.1rem]" />}
      >
        <DropdownLink
          href={`/admin/projects/${project.id}`}
          icon={<Pencil aria-hidden="true" />}
        >
          Edit
        </DropdownLink>
        {project.status === "PUBLISHED" ? (
          <DropdownLink
            href={projectHref(project.slug)}
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
        title={`Delete ${project.title}?`}
        description="This removes the project and its case study page. It can't be undone."
        confirmLabel="Delete project"
        tone="danger"
        confirmPhrase={project.slug}
        pending={remove.pending}
        error={remove.error}
        onConfirm={remove.confirm}
      />
    </>
  );
}
