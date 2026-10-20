import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SocialIcon } from "@/components/icons/social-icon";
import { mainNav } from "@/content/navigation";
import { CATEGORY_LABELS, PROJECT_CATEGORIES } from "@/lib/schemas/content";
import { getProfile, getSocials } from "@/server/dal/profile";
import { Container } from "./container";
import { FooterCta } from "./footer-cta";
import { Logo } from "./logo";

const linkClass =
  "group inline-flex min-h-6 items-center gap-1.5 rounded-md py-0.5 text-sm text-muted-foreground transition-[color,translate] duration-200 hover:translate-x-1 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export async function SiteFooter() {
  const [profile, socials] = await Promise.all([getProfile(), getSocials()]);
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-12 overflow-hidden border-t border-border">
      <div
        aria-hidden="true"
        className="absolute -top-40 left-[10%] -z-10 size-[26rem] rounded-full bg-primary opacity-[0.12] blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 -z-10 size-[20rem] rounded-full bg-secondary opacity-[0.1] blur-[90px]"
      />
      <FooterCta profile={profile} />
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Full-stack software engineer building production web apps, Shopify
            apps, and the systems behind them.
          </p>
          <ul className="flex gap-2" aria-label="Social profiles">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${social.label} (opens in a new tab)`}
                  className="grid size-10 place-items-center rounded-xl border border-border-strong bg-muted text-muted-foreground transition-[translate,background-color,color] duration-300 ease-spring hover:-translate-y-1 hover:bg-gradient-button hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <SocialIcon id={social.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <FooterColumn title="Navigate">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </FooterColumn>
        <FooterColumn title="Work">
          {PROJECT_CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/projects?category=${category}`}
                className={linkClass}
              >
                {CATEGORY_LABELS[category]}
              </Link>
            </li>
          ))}
        </FooterColumn>
        <FooterColumn title="Contact">
          <li>
            <a href={`mailto:${profile.email}`} className={linkClass}>
              <Mail aria-hidden="true" className="size-4" /> {profile.email}
            </a>
          </li>
          <li>
            <a href={profile.phone.href} className={linkClass}>
              <Phone aria-hidden="true" className="size-4" />{" "}
              {profile.phone.display}
            </a>
          </li>
          <li className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin aria-hidden="true" className="size-4" /> {profile.location}
          </li>
        </FooterColumn>
      </Container>
      <div className="border-t border-border bg-background/40">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-[0.8rem] text-muted-foreground sm:flex-row">
          <p>
            © {year} {profile.name}. Designed and built by me.
          </p>
          <Link href="/contact" className={linkClass}>
            Start a conversation{" "}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-[0.82rem] font-bold tracking-wider text-foreground uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}
