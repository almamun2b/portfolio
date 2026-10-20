import { ArrowRight, Mail } from "lucide-react";
import { StatusPill } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import type { Profile } from "@/lib/schemas/content";
import { Container } from "./container";

/** The page close on every route: availability, then the two ways to act. */
export function FooterCta({ profile }: { profile: Profile }) {
  return (
    <Container className="pt-16 sm:pt-20">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-border-strong bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_14%,transparent),color-mix(in_srgb,var(--secondary)_8%,transparent))] px-6 py-12 sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-gradient-brand opacity-25 blur-3xl motion-safe:animate-glow-float"
        />
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-5">
            {profile.availability.open ? (
              <StatusPill tone="success" className="self-start">
                {profile.availability.label}
              </StatusPill>
            ) : null}
            <h2 className="text-[clamp(1.9rem,4.2vw,3.1rem)] leading-[1.08] font-bold tracking-tight">
              Have a role or a project in mind?{" "}
              <span className="text-gradient">Let&apos;s talk.</span>
            </h2>
            <p className="max-w-xl text-muted-foreground">
              {profile.availability.detail}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={`mailto:${profile.email}`} size="lg">
              <Mail aria-hidden="true" /> Email me
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Contact page <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </Container>
  );
}
