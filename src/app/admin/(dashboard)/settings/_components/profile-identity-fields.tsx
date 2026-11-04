"use client";

import { CheckboxGroupField } from "@/components/forms/checkbox-group-field";
import { TextField, TextareaField } from "@/components/forms/form-fields";
import type { ProfileFormInput } from "@/lib/schemas/settings";

const list = (value: unknown) =>
  typeof value === "string" && value ? value.split(",") : [];

export function ProfileIdentityFields({
  profile,
  techOptions,
}: {
  profile: ProfileFormInput;
  techOptions: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          name="name"
          label="Full name"
          defaultValue={profile.name}
          required
        />
        <TextField
          name="shortName"
          label="Short name"
          defaultValue={profile.shortName}
          required
        />
        <TextField
          name="role"
          label="Title"
          hint="Shown under your name."
          defaultValue={profile.role}
          required
        />
        <TextField
          name="careerStart"
          label="Career start (YYYY-MM)"
          hint="Years of experience are worked out from this."
          defaultValue={profile.careerStart}
          required
        />
      </div>
      <TextareaField
        name="roles"
        label="Rotating roles"
        hint="One per line. They cycle in the hero."
        defaultValue={String(profile.roles)}
        className="min-h-28"
        required
      />
      <TextareaField
        name="pitch"
        label="Pitch"
        defaultValue={profile.pitch}
        className="min-h-24"
        required
      />
      <TextareaField
        name="about"
        label="About"
        hint="One paragraph per line. {years} becomes your years of experience."
        defaultValue={String(profile.about)}
        className="min-h-44"
        required
      />
      <CheckboxGroupField
        name="primaryStack"
        legend="Headline technologies"
        hint="The profile card and the share image."
        options={techOptions}
        defaultValues={list(profile.primaryStack)}
        columns="sm:grid-cols-3"
      />
      <CheckboxGroupField
        name="stack"
        legend="Everything I ship with"
        hint="The first ten form the hero orbits."
        options={techOptions}
        defaultValues={list(profile.stack)}
        columns="sm:grid-cols-3"
      />
    </div>
  );
}
