import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { SocialIcon } from "@/components/icons/social-icon";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { FaqList } from "@/components/sections/faq-list";
import { StatusPill } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/metadata";
import { getFaq, getProfile, getSocials } from "@/server/dal/profile";
import { ContactForm } from "./_components/contact-form";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Md Abdul Mamun about a full-time role or contract work: email, phone, or the contact form.",
  path: "/contact",
});

function Method({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    // dt/dd must be the group's only children, so the icon sits inside the
    // dt, positioned into the left gutter.
    <div className="relative flex min-h-11 min-w-0 flex-col gap-0.5 pl-15">
      <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 grid size-11 place-items-center rounded-2xl bg-gradient-tile text-primary-strong"
        >
          {icon}
        </span>
        {label}
      </dt>
      <dd className="break-words text-foreground">{children}</dd>
    </div>
  );
}

const link =
  "inline-flex min-h-6 items-center rounded-sm font-medium hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default async function ContactPage() {
  const [profile, socials, faq] = await Promise.all([
    getProfile(),
    getSocials(),
    getFaq(),
  ]);
  return (
    <>
      <PageHero
        path="contact"
        title="Let's build something"
        highlight="together"
        description="Tell me about the role or the project, and the best way to reach you."
      >
        {profile.availability.open ? (
          <StatusPill tone="success" className="self-start">
            {profile.availability.label}
          </StatusPill>
        ) : null}
      </PageHero>
      <Container className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="form-title"
          className="rounded-3xl border border-border glass p-6 sm:p-8"
        >
          <h2
            id="form-title"
            className="mb-6 font-display text-xl font-semibold"
          >
            Send a message
          </h2>
          <ContactForm to={profile.email} />
        </section>
        <div className="flex flex-col gap-8">
          <section
            aria-labelledby="direct-title"
            className="rounded-3xl border border-border glass p-6 sm:p-8"
          >
            <h2
              id="direct-title"
              className="mb-6 font-display text-xl font-semibold"
            >
              Or reach me directly
            </h2>
            <dl className="flex flex-col gap-5">
              <Method icon={<Mail className="size-5" />} label="Email">
                <a href={`mailto:${profile.email}`} className={link}>
                  {profile.email}
                </a>
              </Method>
              <Method icon={<Phone className="size-5" />} label="Phone">
                <a href={profile.phone.href} className={link}>
                  {profile.phone.display}
                </a>
              </Method>
              <Method icon={<MapPin className="size-5" />} label="Location">
                {profile.location}
              </Method>
              <Method icon={<Clock className="size-5" />} label="Timezone">
                {profile.timezone}
              </Method>
            </dl>
            <ul
              className="mt-7 flex flex-wrap gap-2 border-t border-border pt-6"
              aria-label="Social profiles"
            >
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-border-strong bg-muted px-4 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <SocialIcon id={social.id} />
                    {social.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="lg:col-span-2">
          <FaqList items={faq} titleId="faq-title" />
        </div>
      </Container>
    </>
  );
}
