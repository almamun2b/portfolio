import AboutMe from "@/components/modules/Home/AboutMe";
import { Blogs } from "@/components/modules/Home/Blogs";
import CallToAction from "@/components/modules/Home/CallToAction";
import Hero from "@/components/modules/Home/Hero";
import { Projects } from "@/components/modules/Home/Projects";
import Skills from "@/components/modules/Home/Skills";
import Stats from "@/components/modules/Home/Stats";

export default function PortfolioLanding() {
  return (
    <main className="flex flex-col min-h-dvh container mx-auto py-10">
      <Hero />
      <Stats />
      <AboutMe />
      <Skills />
      <Projects />
      <Blogs />
      <CallToAction />
    </main>
  );
}
