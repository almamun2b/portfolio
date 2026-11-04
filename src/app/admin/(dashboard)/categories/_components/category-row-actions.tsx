"use client";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useConfirmAction } from "@/components/forms/use-confirm-action";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Drawer } from "@/components/ui/drawer";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import type { CategoryDTO } from "@/lib/dto";
import { deleteCategoryAction } from "@/server/modules/categories/categories.actions";
import { CategoryForm } from "./category-form";

type Panel = "edit" | "delete" | null;

export function CategoryRowActions({ category }: { category: CategoryDTO }) {
  const [panel, setPanel] = useState<Panel>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const close = () => {
    setPanel(null);
    trigger.current?.focus();
  };
  const done = () => {
    close();
    router.refresh();
  };
  const remove = useConfirmAction({
    run: () => deleteCategoryAction(null, { id: category.id }),
    successMessage: "Category deleted.",
    onDone: done,
  });

  return (
    <>
      <Dropdown
        label={`Actions for ${category.name}`}
        triggerRef={trigger}
        trigger={<Ellipsis aria-hidden="true" className="size-[1.1rem]" />}
      >
        <DropdownItem
          icon={<Pencil aria-hidden="true" />}
          onSelect={() => {
            setPanel("edit");
          }}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          icon={<Trash2 aria-hidden="true" />}
          disabledReason={
            category.projectCount > 0
              ? "Move its projects to another category first."
              : undefined
          }
          onSelect={() => {
            setPanel("delete");
          }}
          className="text-error [&_svg]:text-error"
        >
          Delete
        </DropdownItem>
      </Dropdown>
      <Drawer
        open={panel === "edit"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Edit category"
        description={category.slug}
      >
        {panel === "edit" ? (
          <CategoryForm category={category} onDone={done} onCancel={close} />
        ) : null}
      </Drawer>
      <ConfirmDialog
        open={panel === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            remove.clearError();
            close();
          }
        }}
        title={`Delete ${category.name}?`}
        description="Blog posts using it lose the label. This can't be undone."
        confirmLabel="Delete category"
        tone="danger"
        confirmPhrase={category.slug}
        pending={remove.pending}
        error={remove.error}
        onConfirm={remove.confirm}
      />
    </>
  );
}
