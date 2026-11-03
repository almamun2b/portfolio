"use client";

import { Save } from "lucide-react";
import { ActionForm } from "@/components/forms/action-form";
import { TextField, TextareaField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import type { CategoryDTO } from "@/lib/dto";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/server/modules/categories/categories.actions";

/** Create (no `category`) or edit one category. */
export function CategoryForm({
  category,
  onDone,
  onCancel,
}: {
  category?: CategoryDTO;
  onDone: () => void;
  onCancel: () => void;
}) {
  return (
    <ActionForm
      action={category ? updateCategoryAction : createCategoryAction}
      successMessage={category ? "Category updated." : "Category created."}
      onSuccess={onDone}
      className="flex flex-col gap-5"
      aria-label={category ? "Edit category" : "Add category"}
    >
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <TextField
        name="name"
        label="Name"
        defaultValue={category?.name ?? ""}
        autoComplete="off"
        required
      />
      <TextField
        name="slug"
        label="Slug"
        hint="Used in URLs, like /projects?category=shopify. Lowercase letters, numbers, and dashes."
        defaultValue={category?.slug ?? ""}
        autoComplete="off"
        required
      />
      <TextareaField
        name="description"
        label="Description"
        hint="Optional. For your own reference."
        defaultValue={category?.description ?? ""}
        className="min-h-24"
      />
      <TextField
        name="sortOrder"
        label="Order"
        hint="Lower numbers come first on the site."
        type="number"
        inputMode="numeric"
        min={0}
        defaultValue={category?.sortOrder ?? 0}
      />
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton pendingLabel="Saving">
          <Save aria-hidden="true" />{" "}
          {category ? "Save changes" : "Add category"}
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
