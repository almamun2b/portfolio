import "server-only";
import { z } from "zod";
import { experience as rawExperience } from "@/content/experience";
import { faq as rawFaq } from "@/content/faq";
import {
  education as rawEducation,
  profile as rawProfile,
  socials as rawSocials,
} from "@/content/profile";
import {
  processSteps as rawProcess,
  services as rawServices,
  skillGroups as rawSkills,
} from "@/content/services";
import { yearsSince } from "@/lib/dates";
import {
  educationSchema,
  experienceSchema,
  faqSchema,
  processStepSchema,
  profileSchema,
  serviceSchema,
  skillGroupSchema,
  socialSchema,
  type Education,
  type Experience,
  type Faq,
  type ProcessStep,
  type Profile,
  type Service,
  type SkillGroup,
  type Social,
} from "@/lib/schemas/content";

// Static source today (src/content). Parsing here means a malformed entry
// fails the build instead of rendering broken. When this content moves to
// the database, rewrite these functions and keep their signatures.

const profile = profileSchema.parse(rawProfile);
const socials = z.array(socialSchema).parse(rawSocials);
const education = z.array(educationSchema).parse(rawEducation);
const experience = z.array(experienceSchema).parse(rawExperience);
const services = z.array(serviceSchema).parse(rawServices);
const skillGroups = z.array(skillGroupSchema).parse(rawSkills);
const processSteps = z.array(processStepSchema).parse(rawProcess);
const faq = z.array(faqSchema).parse(rawFaq);

export function getProfile(): Promise<Profile> {
  return Promise.resolve(profile);
}

export function getSocials(): Promise<Social[]> {
  return Promise.resolve(socials);
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
export function getCareerStats(): Promise<{
  years: number;
  companies: number;
  technologies: number;
}> {
  const tech = new Set(skillGroups.flatMap((g) => g.items.map((i) => i.name)));
  return Promise.resolve({
    years: yearsSince(profile.careerStart),
    companies: experience.length,
    technologies: tech.size,
  });
}
