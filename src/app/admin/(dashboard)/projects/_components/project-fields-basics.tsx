"use client";

import {
  CheckboxField,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/form-fields";
import type { ProjectAdminDTO } from "@/lib/dto";
import {
  CONTEXT_LABELS,
  CONTRIBUTION_LABELS,
  COVER_ART_LABELS,
} from "@/lib/content-labels";

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export function ProjectBasicsFields({
  project,
}: {
  project?: ProjectAdminDTO;
}) {
  return (
    <div className="flex flex-col gap-5">
      <TextField
        name="title"
        label="Title"
        defaultValue={project?.title ?? ""}
        required
      />
      <TextField
        name="slug"
        label="Slug"
        hint="The case study lives at /projects/<slug>. Lowercase letters, numbers, and dashes."
        defaultValue={project?.slug ?? ""}
        autoComplete="off"
        required
      />
      <TextareaField
        name="tagline"
        label="Tagline"
        hint="One sentence under the title."
        defaultValue={project?.tagline ?? ""}
        className="min-h-20"
        required
      />
      <TextareaField
        name="summary"
        label="Summary"
        hint="Shown on the project card and in search results."
        defaultValue={project?.summary ?? ""}
        className="min-h-28"
        required
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField
          name="context"
          label="Built at"
          hint="Employer work is anonymized: no client or product names."
          defaultValue={project?.context ?? "personal"}
          options={toOptions(CONTEXT_LABELS)}
        />
        <SelectField
          name="contribution"
          label="My part"
          defaultValue={project?.contribution ?? "owner"}
          options={toOptions(CONTRIBUTION_LABELS)}
        />
        <TextField
          name="role"
          label="Role line"
          hint='For example "Co-builder · owned the inventory module".'
          defaultValue={project?.role ?? ""}
          required
        />
        <TextField
          name="year"
          label="Year"
          inputMode="numeric"
          defaultValue={project?.year ?? String(new Date().getFullYear())}
          required
        />
        <SelectField
          name="coverArt"
          label="Cover illustration"
          hint="Used when the project has no screenshot."
          defaultValue={project?.coverArt ?? "terminal"}
          options={toOptions(COVER_ART_LABELS)}
        />
        <TextField
          name="sortOrder"
          label="Order"
          hint="Lower numbers come first. Leave empty to add at the end."
          type="number"
          inputMode="numeric"
          min={0}
          defaultValue={project?.sortOrder ?? ""}
        />
      </div>
      <CheckboxField
        name="featured"
        label="Feature on the landing page"
        defaultChecked={project?.featured ?? false}
      />
    </div>
  );
}
