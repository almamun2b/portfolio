import { Download, Mail } from "lucide-react";
import Image from "next/image";
import portrait from "@/assets/portrait-square.jpg";
import { Container, Section } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { ExperienceList } from "@/components/sections/experience-list";
import { FaqList } from "@/components/sections/faq-list";
import { ProfileFile } from "@/components/sections/profile-file";
import { ButtonLink } from "@/components/ui/button-link";
import { profilePageJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import {
  getEducation,
  getExperience,
  getFaq,
  getProfile,
  getSkillGroups,
} from "@/server/modules/content/profile.service";
import { EducationCards } from "@/components/sections/education-cards";
import { SkillTabs } from "./_components/skill-tabs";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Md Abdul Mamun: full-stack software engineer at Xubitar, previously four years at Devxhub. Skills, experience, education, and how to work with me.",
  path: "/about",
  type: "profile",
});

export default async function AboutPage() {
  const [profile, experience, education, skills, faq] = await Promise.all([
    getProfile(),
    getExperience(),
    getEducation(),
    getSkillGroups(),
    getFaq(),
  ]);
  const current = experience.find((job) => !job.end);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(profilePageJsonLd("/about")),
        }}
      />
      <PageHero
        path="about"
        title="Hi, I'm"
        highlight={`${profile.shortName}.`}
        description={profile.role}
        aside={
          <div className="relative mx-auto w-[min(100%,22rem)]">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2.5rem] bg-gradient-brand opacity-30 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-border-strong bg-gradient-brand p-[3px]">
              <Image
                src={portrait}
                alt={`Portrait of ${profile.name}`}
                placeholder="blur"
                preload
                sizes="(min-width: 1024px) 22rem, 80vw"
                className="rounded-[calc(2rem-3px)]"
              />
            </div>
          </div>
        }
      >
        <div className="flex max-w-2xl flex-col gap-5 text-[1.05rem] leading-[1.8] text-muted-foreground">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={profile.resume.href}
            download={profile.resume.fileName}
            size="lg"
          >
            <Download aria-hidden="true" /> Download CV
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" size="lg">
            <Mail aria-hidden="true" /> Get in touch
          </ButtonLink>
        </div>
      </PageHero>

      <Container className="pb-4">
        <ProfileFile profile={profile} current={current} />
      </Container>

      <Section id="skills" aria-labelledby="skills-title">
        <SectionHeading
          id="skills-title"
          path="about/skills"
          title="Skills and"
          highlight="tools"
          description="Grouped the way I use them. No percentages: the projects show the depth."
        />
        <SkillTabs groups={skills} />
      </Section>

      <Section id="experience" aria-labelledby="experience-title">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-12">
            <SectionHeading
              id="experience-title"
              path="about/experience"
              title="Experience"
            />
            <ExperienceList experience={experience} full />
          </div>
          <div className="flex flex-col gap-12">
            <SectionHeading path="about/education" title="Education" as="h2" />
            <EducationCards
              education={education}
              languages={profile.languages}
            />
          </div>
        </div>
      </Section>

      <Container className="pb-12">
        <FaqList items={faq} titleId="faq-title" />
      </Container>
    </>
  );
}
