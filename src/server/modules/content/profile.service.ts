import "server-only";
import { z } from "zod";
import { cacheLife, cacheTag } from "next/cache";
import { experience as rawExperience } from "@/content/experience";
import { faq as rawFaq } from "@/content/faq";
import { education as rawEducation } from "@/content/profile";
import {
  processSteps as rawProcess,
  services as rawServices,
  skillGroups as rawSkills,
} from "@/content/services";
import { yearsSince } from "@/lib/dates";
import { CACHE_TAGS } from "@/server/core/cache";
import { readProfile, readSocials } from "../settings/settings.model";
import {
  educationSchema,
  experienceSchema,
  faqSchema,
  processStepSchema,
  serviceSchema,
  skillGroupSchema,
  type Education,
  type Experience,
  type Faq,
  type ProcessStep,
  type Profile,
  type Service,
  type SkillGroup,
  type Social,
} from "@/lib/schemas/content";

// The profile and social links live in Postgres (SiteSetting, edited at
// /admin/settings) and are read through tagged, cached getters, so pages are
// prerendered and a settings save refreshes them. Education, experience,
// services, the process, skills, and the FAQ are still static files (src/
// content); parsing here means a malformed entry fails the build.

const education = z.array(educationSchema).parse(rawEducation);
const experience = z.array(experienceSchema).parse(rawExperience);
const services = z.array(serviceSchema).parse(rawServices);
const skillGroups = z.array(skillGroupSchema).parse(rawSkills);
const processSteps = z.array(processStepSchema).parse(rawProcess);
const faq = z.array(faqSchema).parse(rawFaq);

/**
 * `{years}` in the bio is filled from careerStart, so it never goes stale.
 * Cached for a day: the figure depends on today's date, which a prerender may
 * only read inside a cached scope.
 */
export async function getProfile(): Promise<Profile> {
  "use cache";
  cacheTag(CACHE_TAGS.SETTINGS);
  cacheLife("days");
  const profile = await readProfile();
  const years = String(yearsSince(profile.careerStart));
  return {
    ...profile,
    about: profile.about.map((p) => p.replaceAll("{years}", years)),
  };
}

export async function getSocials(): Promise<Social[]> {
  "use cache";
  cacheTag(CACHE_TAGS.SETTINGS);
  cacheLife("days");
  return readSocials();
}

export function getEducation(): Promise<Education[]> {
  return Promise.resolve(education);
}

export function getExperience(): Promise<Experience[]> {
  return Promise.resolve(experience);
}

export function getServices(): Promise<Service[]> {
  return Promise.resolve(services);
}

export function getSkillGroups(): Promise<SkillGroup[]> {
  return Promise.resolve(skillGroups);
}

export function getProcessSteps(): Promise<ProcessStep[]> {
  return Promise.resolve(processSteps);
}

export function getFaq(): Promise<Faq[]> {
  return Promise.resolve(faq);
}

/** Numbers shown on the site, derived from content so none can be invented. */
export async function getCareerStats(): Promise<{
  years: number;
  companies: number;
  technologies: number;
}> {
  "use cache";
  cacheTag(CACHE_TAGS.SETTINGS);
  cacheLife("days");
  const profile = await readProfile();
  const tech = new Set(skillGroups.flatMap((g) => g.items.map((i) => i.name)));
  return {
    years: yearsSince(profile.careerStart),
    companies: experience.length,
    technologies: tech.size,
  };
}
