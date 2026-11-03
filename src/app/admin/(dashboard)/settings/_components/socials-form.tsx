"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { ActionForm } from "@/components/forms/action-form";
import { TextField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card } from "@/components/ui/card";
import { updateSocialsAction } from "@/server/modules/settings/settings.actions";

const NETWORKS = [
  { id: "github", label: "GitHub", placeholder: "https://github.com/you" },
  {
    id: "linkedin",
    label: "LinkedIn",
    placeholder: "https://www.linkedin.com/in/you",
  },
  { id: "x", label: "X", placeholder: "https://x.com/you" },
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/you",
  },
] as const;

export function SocialsForm({ socials }: { socials: Record<string, string> }) {
  const router = useRouter();
  return (
    <ActionForm
      action={updateSocialsAction}
      successMessage="Social links saved."
      onSuccess={() => {
        router.refresh();
      }}
      className="flex flex-col gap-6"
      aria-label="Social links"
    >
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Leave a network empty to hide it. The handle shown on the site is
          taken from the link.
        </p>
        {NETWORKS.map((network) => (
          <TextField
            key={network.id}
            name={network.id}
            label={network.label}
            type="url"
            inputMode="url"
            placeholder={network.placeholder}
            defaultValue={socials[network.id] ?? ""}
          />
        ))}
      </Card>
      <div className="flex justify-end">
        <SubmitButton pendingLabel="Saving">
          <Save aria-hidden="true" /> Save links
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
