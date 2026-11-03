"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { ActionForm } from "@/components/forms/action-form";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import type { ProfileFormInput } from "@/lib/schemas/settings";
import { updateProfileAction } from "@/server/modules/settings/settings.actions";
import { ProfileContactFields } from "./profile-contact-fields";
import { ProfileIdentityFields } from "./profile-identity-fields";

export function ProfileForm({
  profile,
  techOptions,
}: {
  profile: ProfileFormInput;
  techOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  return (
    <ActionForm
      action={updateProfileAction}
      successMessage="Profile saved. The site updates right away."
      onSuccess={() => {
        router.refresh();
      }}
      className="flex flex-col gap-6"
      aria-label="Profile"
    >
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Identity</h2>
        <ProfileIdentityFields profile={profile} techOptions={techOptions} />
      </Card>
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Contact and availability</h2>
        <ProfileContactFields profile={profile} />
      </Card>
      <div className="flex justify-end">
        <SubmitButton pendingLabel="Saving">
          <Save aria-hidden="true" /> Save profile
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
