import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import type { Education, Experience, Profile } from "@/lib/schemas/content";
import { EducationCards } from "./education-cards";
import { ExperienceList } from "./experience-list";

export function ExperienceSection({
  experience,
  education,
  languages,
}: {
  experience: Experience[];
  education: Education[];
  languages: Profile["languages"];
}) {
  return (
    <Section id="experience" aria-labelledby="experience-title">
      <SectionHeading
        id="experience-title"
        path="experience"
        title="Where I've"
        highlight="worked"
        description="Four years shipping client products at Devxhub, now building e-commerce systems at Xubitar."
      />
      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
        <ExperienceList experience={experience} />
        <div className="flex flex-col gap-5 lg:self-start">
          <EducationCards
            education={education}
            languages={languages}
            className="lg:static"
          />
          <ButtonLink href="/about" variant="ghost" className="self-start">
            Full history on the About page <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
