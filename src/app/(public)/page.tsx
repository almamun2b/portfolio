import AboutMe from "@/components/modules/Home/AboutMe";
import { Blogs } from "@/components/modules/Home/Blogs";
import CallToAction from "@/components/modules/Home/CallToAction";
import Contact from "@/components/modules/Home/Contact";
import Experience from "@/components/modules/Home/Experience";
import Hero from "@/components/modules/Home/Hero";
import { Projects } from "@/components/modules/Home/Projects";
import Skills from "@/components/modules/Home/Skills";
import TechStack from "@/components/modules/Home/TechStack";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Md Abdul Mamun | Portfolio",
  description:
    "A passionate Software Engineer with 3.5+ years of experience building modern, scalable, and user-friendly applications using Next.js, Nuxt.js, Astro.js, and more.",
};

export default async function PortfolioLanding() {
  const projectsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/project?limit=6&page=1`,
    {
      next: {
        tags: ["PROJECTS"],
      },
    },
  );
  const projectsData = await projectsRes.json();

  const blogsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/blog?limit=3&page=1`,
    {
      next: {
        tags: ["BLOGS"],
      },
    },
  );
  const blogsData = await blogsRes.json();

  return (
    <main className="flex flex-col min-h-dvh">
      <Hero />
      <TechStack />
      <AboutMe />
      <Skills />
      <Experience />
      <Projects projectsData={projectsData} />
      <Blogs blogsData={blogsData} />
      <Contact />
      <CallToAction />
    </main>
  );
}
