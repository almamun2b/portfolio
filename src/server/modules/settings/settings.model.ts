import "server-only";
import { defaultProfile, defaultSocials } from "../content/profile-defaults";
import type { Prisma } from "@/generated/prisma/client";
import {
  profileSchema,
  type Profile,
  type Social,
} from "@/lib/schemas/content";
import {
  socialsStoredSchema,
  type ProfileFormInput,
  type profileFormSchema,
  type updateSocialsSchema,
} from "@/lib/schemas/settings";
import { db } from "@/server/core/db";
import type { z } from "zod";

// Settings are JSON documents in SiteSetting. A missing row falls back to the
// seed defaults in src/content/profile.ts, so a fresh database still renders;
// `pnpm db:seed` writes them so the admin edits a real row.

export async function readProfile(): Promise<Profile> {
  const row = await db.siteSetting.findUnique({ where: { key: "profile" } });
  if (!row) return profileSchema.parse(defaultProfile);
  return profileSchema.parse(row.value);
}

export async function readSocials(): Promise<Social[]> {
  const row = await db.siteSetting.findUnique({ where: { key: "socials" } });
  if (!row) return socialsStoredSchema.parse(defaultSocials);
  return socialsStoredSchema.parse(row.value);
}

type ProfileForm = z.output<typeof profileFormSchema>;
type SocialsForm = z.output<typeof updateSocialsSchema>;

/** Maps the settings form back to the stored `Profile` document. */
export function toProfile(form: ProfileForm): Profile {
  return profileSchema.parse({
    name: form.name,
    shortName: form.shortName,
    role: form.role,
    roles: form.roles,
    pitch: form.pitch,
    about: form.about,
    location: form.location,
    timezone: form.timezone,
    email: form.email,
    phone: { display: form.phoneDisplay, href: form.phoneHref },
    whatsapp: form.whatsapp,
    availability: {
      open: form.availabilityOpen,
      label: form.availabilityLabel,
      detail: form.availabilityDetail,
    },
    careerStart: form.careerStart,
    primaryStack: form.primaryStack,
    stack: form.stack,
    resume: { href: form.resumeHref, fileName: form.resumeFileName },
    languages: form.languages.map((line) => {
      const [name = "", level = ""] = line.split("|").map((s) => s.trim());
      return { name, level };
    }),
  });
}

/** Form values for the settings editor (the reverse of `toProfile`). */
export function toProfileForm(profile: Profile): ProfileFormInput {
  return {
    name: profile.name,
    shortName: profile.shortName,
    role: profile.role,
    roles: profile.roles.join("\n"),
    pitch: profile.pitch,
    about: profile.about.join("\n"),
    location: profile.location,
    timezone: profile.timezone,
    email: profile.email,
    phoneDisplay: profile.phone.display,
    phoneHref: profile.phone.href,
    whatsapp: profile.whatsapp,
    availabilityOpen: profile.availability.open,
    availabilityLabel: profile.availability.label,
    availabilityDetail: profile.availability.detail,
    careerStart: profile.careerStart,
    primaryStack: profile.primaryStack.join(","),
    stack: profile.stack.join(","),
    resumeHref: profile.resume.href,
    resumeFileName: profile.resume.fileName,
    languages: profile.languages
      .map((l) => `${l.name} | ${l.level}`)
      .join("\n"),
  };
}

const SOCIAL_LABELS = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
  facebook: "Facebook",
} as const;

function handleFromUrl(id: keyof typeof SOCIAL_LABELS, href: string): string {
  const segments = new URL(href).pathname.split("/").filter(Boolean);
  const last = segments.at(-1) ?? new URL(href).hostname;
  return id === "x" ? `@${last.replace(/^@/, "")}` : last;
}

/** Only the networks with a URL are kept, in a fixed display order. */
export function toSocials(form: SocialsForm): Social[] {
  const out: Social[] = [];
  for (const id of Object.keys(
    SOCIAL_LABELS,
  ) as (keyof typeof SOCIAL_LABELS)[]) {
    const href = form[id];
    if (href) {
      out.push({
        id,
        label: SOCIAL_LABELS[id],
        handle: handleFromUrl(id, href),
        href,
      });
    }
  }
  return socialsStoredSchema.parse(out);
}

export type SettingValue = Prisma.InputJsonValue;
