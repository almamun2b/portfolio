"use client";

import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";
import type { ProfileFormInput } from "@/lib/schemas/settings";
import { ProfileForm } from "./profile-form";
import { SocialsForm } from "./socials-form";

export function SettingsTabs({
  profile,
  socials,
  techOptions,
}: {
  profile: ProfileFormInput;
  socials: Record<string, string>;
  techOptions: { value: string; label: string }[];
}) {
  return (
    <Tabs defaultValue="profile" className="flex flex-col gap-6">
      <TabsList label="Settings sections">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="socials">Social links</TabsTrigger>
      </TabsList>
      <TabsPanel value="profile">
        <ProfileForm profile={profile} techOptions={techOptions} />
      </TabsPanel>
      <TabsPanel value="socials">
        <SocialsForm socials={socials} />
      </TabsPanel>
    </Tabs>
  );
}
