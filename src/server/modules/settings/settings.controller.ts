import "server-only";
import {
  updateProfileSchema,
  updateSocialsSchema,
} from "@/lib/schemas/settings";
import { apiRoute } from "@/server/core/http/route";
import { settingsTags } from "./settings.constants";
import { getSettings, updateProfile, updateSocials } from "./settings.service";

export const getSettingsRoute = apiRoute(
  { name: "settings.get", auth: "admin" },
  () => getSettings(),
);

export const updateProfileRoute = apiRoute(
  {
    name: "settings.updateProfile",
    auth: "admin",
    body: updateProfileSchema,
    message: "Profile updated.",
    tags: () => settingsTags.updateProfile(),
  },
  ({ body }) => updateProfile(body),
);

export const updateSocialsRoute = apiRoute(
  {
    name: "settings.updateSocials",
    auth: "admin",
    body: updateSocialsSchema,
    message: "Social links updated.",
    tags: () => settingsTags.updateSocials(),
  },
  ({ body }) => updateSocials(body),
);
