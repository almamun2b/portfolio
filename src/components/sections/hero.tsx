import { ArrowRight, Download, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { SocialIcon } from "@/components/icons/social-icon";
import { Container } from "@/components/layout/container";
import { StatusPill } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Typewriter } from "@/components/ui/typewriter";
import type { Profile, Social } from "@/lib/schemas/content";

/**
 * First viewport: who, what, and the two actions, with the visual as a slot
 * so it can be swapped without touching the copy.
 */
export function Hero({
  profile,
  socials,
  visual,
}: {
  profile: Profile;
  socials: Social[];
  visual: ReactNode;
}) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex items-center overflow-x-clip pt-8 pb-16 sm:pt-14 lg:min-h-[calc(100dvh-70px)] lg:py-12"
    >
      <div
        aria-hidden="true"
        className="absolute top-[12%] left-[-8rem] -z-10 size-[25rem] rounded-full bg-primary opacity-[0.1] blur-[60px] motion-safe:animate-glow-float"
      />
      <div
        aria-hidden="true"
        className="absolute right-[-6rem] bottom-[8%] -z-10 size-[19rem] rounded-full bg-secondary opacity-[0.08] blur-[60px] [animation-delay:-4s] motion-safe:animate-glow-float"
      />

      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-10">
        <div className="flex flex-col items-start gap-7">
          {profile.availability.open ? (
            <StatusPill tone="success">{profile.availability.label}</StatusPill>
          ) : null}

          <div className="flex flex-col gap-4">
            <h1 id="hero-title" className="font-bold tracking-tight">
              <span className="mt-1 block text-gradient-display text-[clamp(2.6rem,6.4vw,4.75rem)] leading-[1.02]">
                {profile.name}
              </span>
            </h1>
            <p className="font-display text-[clamp(1.15rem,2.2vw,1.6rem)] font-semibold text-foreground">
              <Typewriter words={profile.roles} />
            </p>
          </div>

          <p className="max-w-[36rem] text-[1.05rem] leading-[1.75] text-muted-foreground sm:text-lg">
            {profile.pitch}
          </p>

          <div
            data-hero-ctas=""
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <ButtonLink href="/projects" size="lg">
              View my work <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={profile.resume.href}
              download={profile.resume.fileName}
              variant="outline"
              size="lg"
            >
              <Download aria-hidden="true" /> Download CV
            </ButtonLink>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin
                aria-hidden="true"
                className="size-4 text-secondary-strong"
              />
              {profile.location}
            </span>
            <ul
              className="flex items-center gap-1.5"
              aria-label="Social profiles"
            >
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="grid size-10 place-items-center rounded-full text-muted-foreground transition-[color,background-color,translate] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <SocialIcon id={social.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative">{visual}</div>
      </Container>
    </section>
  );
}
