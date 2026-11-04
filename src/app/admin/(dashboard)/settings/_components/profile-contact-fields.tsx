"use client";

import {
  CheckboxField,
  TextField,
  TextareaField,
} from "@/components/forms/form-fields";
import type { ProfileFormInput } from "@/lib/schemas/settings";

export function ProfileContactFields({
  profile,
}: {
  profile: ProfileFormInput;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          name="email"
          label="Email"
          type="email"
          inputMode="email"
          defaultValue={profile.email}
          required
        />
        <TextField
          name="location"
          label="Location"
          defaultValue={profile.location}
          required
        />
        <TextField
          name="phoneDisplay"
          label="Phone (as shown)"
          defaultValue={profile.phoneDisplay}
          required
        />
        <TextField
          name="phoneHref"
          label="Phone link"
          hint="For example tel:+8801610088700."
          defaultValue={profile.phoneHref}
          required
        />
        <TextField
          name="whatsapp"
          label="WhatsApp number"
          hint="Digits only, with country code."
          inputMode="numeric"
          defaultValue={profile.whatsapp}
          required
        />
        <TextField
          name="timezone"
          label="Time zone"
          defaultValue={profile.timezone}
          required
        />
        <TextField
          name="resumeHref"
          label="Resume path"
          hint="A PDF under /public, like /resume.pdf."
          defaultValue={profile.resumeHref}
          required
        />
        <TextField
          name="resumeFileName"
          label="Resume download name"
          defaultValue={profile.resumeFileName}
          required
        />
      </div>
      <CheckboxField
        name="availabilityOpen"
        label="Open to new opportunities"
        defaultChecked={profile.availabilityOpen === true}
      />
      <TextField
        name="availabilityLabel"
        label="Availability label"
        defaultValue={profile.availabilityLabel}
        required
      />
      <TextareaField
        name="availabilityDetail"
        label="Availability detail"
        defaultValue={profile.availabilityDetail}
        className="min-h-20"
        required
      />
      <TextareaField
        name="languages"
        label="Languages"
        hint="One per line as: Language | Level"
        defaultValue={String(profile.languages)}
        className="min-h-24"
      />
    </div>
  );
}
