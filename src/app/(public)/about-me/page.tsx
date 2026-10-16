import { AboutHero } from "@/components/modules/AboutMe/AboutHero";
import { PersonalInfo } from "@/components/modules/AboutMe/PersonalInfo";
import CallToAction from "@/components/modules/Home/CallToAction";
import Education from "@/components/modules/Home/Education";
import Experience from "@/components/modules/Home/Experience";
import Skills from "@/components/modules/Home/Skills";
import TechStack from "@/components/modules/Home/TechStack";

export const metadata = {
  title: "About Me | Md Abdul Mamun",
  description:
    "Learn more about Md Abdul Mamun, a passionate Frontend Developer with 3.5+ years of experience.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-dvh">
      {/* Container for unified padding */}
      <div className="px-6 container mx-auto">
        <AboutHero />
        <PersonalInfo />
      </div>

      {/* Sections with internal containers */}
      <TechStack />
      <Skills />
      <Experience />
      <Education />
      <CallToAction />
    </main>
  );
}
