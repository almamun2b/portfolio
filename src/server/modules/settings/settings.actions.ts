"use server";

import {
  updateProfileSchema,
  updateSocialsSchema,
} from "@/lib/schemas/settings";
import { adminAction } from "@/server/core/action";
import { settingsTags } from "./settings.constants";
import { updateProfile, updateSocials } from "./settings.service";

export const updateProfileAction = adminAction(
  "settings.updateProfile",
  updateProfileSchema,
  async (data) => {
    await updateProfile(data);
  },
  { tags: settingsTags.updateProfile },
);

export const updateSocialsAction = adminAction(
  "settings.updateSocials",
  updateSocialsSchema,
  async (data) => {
    await updateSocials(data);
  },
  { tags: settingsTags.updateSocials },
);
