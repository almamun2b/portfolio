import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getTech } from "@/lib/tech";
import { TECH_IDS } from "@/lib/tech-ids";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { getSettings } from "@/server/modules/settings/settings.service";
import { toProfileForm } from "@/server/modules/settings/settings.model";
import { SettingsTabs } from "./_components/settings-tabs";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const { profile, socials } = await getSettings();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Your name, contact details, and links. They appear in the header, footer, hero, and search results on every page."
      />
      <SettingsTabs
        profile={toProfileForm(profile)}
        socials={Object.fromEntries(socials.map((s) => [s.id, s.href]))}
        techOptions={TECH_IDS.map((id) => ({
          value: id,
          label: getTech(id).label,
        }))}
      />
    </div>
  );
}
