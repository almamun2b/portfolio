import { AboutHero } from "@/components/modules/AboutMe/AboutHero";
import { PersonalInfo } from "@/components/modules/AboutMe/PersonalInfo";
import { WorkExperience } from "@/components/modules/AboutMe/WorkExperience";
import CallToAction from "@/components/modules/Home/CallToAction";
import Skills from "@/components/modules/Home/Skills";
import Stats from "@/components/modules/Home/Stats";

export const metadata = {
  title: "About Me",
  description: "Learn more about me and my work.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-8 py-16">
      <AboutHero />
      <PersonalInfo />
      <Stats />
      <WorkExperience />
      <Skills />
      <CallToAction />
    </main>
  );
}
