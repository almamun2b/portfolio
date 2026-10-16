import AboutMe from "@/components/modules/Home/AboutMe";
import CallToAction from "@/components/modules/Home/CallToAction";
import Contact from "@/components/modules/Home/Contact";
import Experience from "@/components/modules/Home/Experience";
import Hero from "@/components/modules/Home/Hero";
import { Projects } from "@/components/modules/Home/Projects";
import Skills from "@/components/modules/Home/Skills";
import TechStack from "@/components/modules/Home/TechStack";
import { getProjects } from "@/lib/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Md Abdul Mamun | Full-Stack Software Engineer",
  description:
    "Full-Stack Software Engineer with 4+ years of experience building scalable, secure, and high-performance web applications using React, Next.js, Vue/Nuxt, Node.js, Express.js, PostgreSQL, and MongoDB.",
};

export const dynamic = "force-dynamic";

export default async function PortfolioLanding() {
  const projectsData = await getProjects({ limit: 6, page: 1 });

  return (
    <main className="flex flex-col min-h-dvh">
      <Hero />
      <TechStack />
      <AboutMe />
      <Skills />
      <Experience />
      <Projects projectsData={projectsData} />
      <Contact />
      <CallToAction />
    </main>
  );
}
