import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/effects/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { StatCounter } from "@/components/ui/stat-counter";
import type { Experience, Profile } from "@/lib/schemas/content";
import { ProfileFile } from "./profile-file";

/** Home "about": the short story, checkable numbers, and the profile as code. */
export function AboutSummary({
  profile,
  current,
  stats,
}: {
  profile: Profile;
  current: Experience | undefined;
  stats: { label: string; value: number; suffix?: string }[];
}) {
  return (
    <Section id="about" aria-labelledby="about-title">
      <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="about-title"
            path="about"
            title="I build the whole thing,"
            highlight="front to back."
          />
          <div className="flex max-w-[38rem] flex-col gap-5 text-[1.03rem] leading-[1.8] text-muted-foreground">
            {profile.about.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 bg-[color-mix(in_srgb,var(--card-solid)_92%,transparent)] px-5 py-5"
              >
                <dt className="order-2 text-[0.72rem] font-semibold tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-[2.1rem] leading-none font-bold text-foreground">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/about" variant="outline" className="self-start">
            More about me <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
        <Reveal>
          <ProfileFile profile={profile} current={current} />
        </Reveal>
      </div>
    </Section>
  );
}
