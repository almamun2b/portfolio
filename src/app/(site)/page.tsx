import { Briefcase, Layers, Sparkles } from "lucide-react";
import { AboutSummary } from "@/components/sections/about-summary";
import { ExperienceSection } from "@/components/sections/experience-section";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { PortraitOrbit } from "@/components/sections/hero-visual/portrait-orbit";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import {
  getCareerStats,
  getEducation,
  getExperience,
  getProcessSteps,
  getProfile,
  getServices,
  getSocials,
} from "@/server/dal/profile";
import { getProjectCounts, getProjects } from "@/server/dal/projects";

export const metadata = pageMetadata({
  description: site.description,
  path: "/",
});

export default async function HomePage() {
  const [
    profile,
    socials,
    experience,
    education,
    services,
    steps,
    stats,
    featured,
    counts,
  ] = await Promise.all([
    getProfile(),
    getSocials(),
    getExperience(),
    getEducation(),
    getServices(),
    getProcessSteps(),
    getCareerStats(),
    getProjects({ featured: true }),
    getProjectCounts(),
  ]);
  const current = experience.find((job) => !job.end);

  return (
    <>
      <Hero
        profile={profile}
        socials={socials}
        visual={
          <PortraitOrbit
            name={profile.name}
            pills={[
              {
                label: `${String(stats.years)}+ years shipping`,
                icon: Sparkles,
                tone: "primary",
              },
              ...(current
                ? [
                    {
                      label: `Now at ${current.company}`,
                      icon: Briefcase,
                      tone: "success" as const,
                    },
                  ]
                : []),
              { label: "Frontend → database", icon: Layers, tone: "secondary" },
            ]}
          />
        }
      />
      <TechMarquee />
      <AboutSummary
        profile={profile}
        current={current}
        stats={[
          { label: "Years experience", value: stats.years, suffix: "+" },
          { label: "Companies", value: stats.companies },
          { label: "Case studies", value: counts.total },
          { label: "Live demos", value: counts.live },
        ]}
      />
      <Services services={services} />
      <FeaturedProjects projects={featured} total={counts.total} />
      <ExperienceSection
        experience={experience}
        education={education}
        languages={profile.languages}
      />
      <Process steps={steps} />
    </>
  );
}
