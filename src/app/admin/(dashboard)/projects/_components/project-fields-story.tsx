"use client";

import { CheckboxGroupField } from "@/components/forms/checkbox-group-field";
import { TextField, TextareaField } from "@/components/forms/form-fields";
import { ShotsField } from "@/components/forms/shots-field";
import type { ProjectAdminDTO } from "@/lib/dto";

export interface Option {
  value: string;
  label: string;
}

export function ProjectStoryFields({
  project,
  categories,
  techOptions,
}: {
  project?: ProjectAdminDTO;
  categories: Option[];
  techOptions: Option[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <CheckboxGroupField
        name="categoryIds"
        legend="Categories"
        hint="Pick at least one. Manage them under Categories."
        options={categories}
        defaultValues={project?.categories.map((c) => c.id)}
      />
      <CheckboxGroupField
        name="stack"
        legend="Technologies"
        hint="Shown as logos on the case study."
        options={techOptions}
        defaultValues={project?.stack}
        columns="sm:grid-cols-3"
      />
      <TextareaField
        name="problem"
        label="The problem"
        defaultValue={project?.problem ?? ""}
        className="min-h-28"
        required
      />
      <TextareaField
        name="approach"
        label="Approach"
        hint="One point per line."
        defaultValue={project?.approach.join("\n") ?? ""}
        className="min-h-32"
        required
      />
      <TextareaField
        name="outcomes"
        label="Outcomes"
        hint="One point per line. Only numbers you can verify."
        defaultValue={project?.outcomes.join("\n") ?? ""}
        className="min-h-28"
        required
      />
      <TextareaField
        name="myPart"
        label="My part (optional)"
        hint="One point per line. Use it when others built the rest."
        defaultValue={project?.myPart.join("\n") ?? ""}
        className="min-h-28"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          name="liveUrl"
          label="Live site (optional)"
          type="url"
          inputMode="url"
          defaultValue={project?.links.live ?? ""}
        />
        <TextField
          name="sourceUrl"
          label="Source code (optional)"
          type="url"
          inputMode="url"
          defaultValue={project?.links.source ?? ""}
        />
        <TextField
          name="apiUrl"
          label="API (optional)"
          type="url"
          inputMode="url"
          defaultValue={project?.links.api ?? ""}
        />
        <TextField
          name="apiSourceUrl"
          label="API source (optional)"
          type="url"
          inputMode="url"
          defaultValue={project?.links.apiSource ?? ""}
        />
      </div>
      <ShotsField name="media" defaultValue={project?.media} />
    </div>
  );
}
