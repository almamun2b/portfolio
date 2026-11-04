import type { Profile, Social } from "@/lib/schemas/content";
import {
  profileFormSchema,
  updateSocialsSchema,
  type ProfileFormInput,
} from "@/lib/schemas/settings";
import { writeAudit } from "@/server/core/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { assertAdmin, requireAdmin } from "@/server/modules/auth/auth.guard";
import { cacheLife, cacheTag } from "next/cache";
import type { z } from "zod";
import "server-only";
import {
  readProfile,
  readSocials,
  toProfile,
  toSocials,
} from "./settings.model";

export interface SettingsDTO {
  profile: Profile;
  socials: Social[];
}

/** The stored documents, raw (`{years}` unexpanded), for the settings editor. */
export async function getSettings(): Promise<SettingsDTO> {
  await requireAdmin();
  return getSettingsCached();
}

async function getSettingsCached(): Promise<SettingsDTO> {
  "use cache";
  cacheTag(CACHE_TAGS.SETTINGS);
  cacheLife("admin");
  const [profile, socials] = await Promise.all([readProfile(), readSocials()]);
  return { profile, socials };
}

export async function updateProfile(input: ProfileFormInput): Promise<Profile> {
  const actor = await assertAdmin();
  const profile = toProfile(profileFormSchema.parse(input));
  await db.$transaction(async (tx) => {
    await tx.siteSetting.upsert({
      where: { key: "profile" },
      create: { key: "profile", value: profile },
      update: { value: profile },
    });
    await writeAudit(
      {
        actorId: actor.id,
        action: "settings.update",
        targetType: "settings",
        targetId: "profile",
      },
      tx,
    );
  });
  return profile;
}

export async function updateSocials(
  input: z.input<typeof updateSocialsSchema>,
): Promise<Social[]> {
  const actor = await assertAdmin();
  const socials = toSocials(updateSocialsSchema.parse(input));
  await db.$transaction(async (tx) => {
    await tx.siteSetting.upsert({
      where: { key: "socials" },
      create: { key: "socials", value: socials },
      update: { value: socials },
    });
    await writeAudit(
      {
        actorId: actor.id,
        action: "settings.update",
        targetType: "settings",
        targetId: "socials",
      },
      tx,
    );
  });
  return socials;
}
