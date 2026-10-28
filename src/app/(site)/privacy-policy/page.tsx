import { LegalPage, LegalSection } from "@/components/layout/legal-page";
import { pageMetadata } from "@/lib/metadata";
import { getProfile } from "@/server/modules/content/profile.service";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "What this portfolio does and doesn't collect: no accounts, no cookies, no analytics, and contact only through your own email or WhatsApp.",
  path: "/privacy-policy",
});

// Describe only what the site actually does. Update this page (and the date)
// before adding analytics, a contact backend, or anything that sets cookies.
const UPDATED = "2026-10-21";

export default async function PrivacyPage() {
  const profile = await getProfile();
  const email = <a href={`mailto:${profile.email}`}>{profile.email}</a>;
  return (
    <LegalPage
      path="privacy-policy"
      name="Privacy policy"
      title="Privacy"
      highlight="policy"
      description="This is a personal portfolio. It collects as little as it can, and this page lists all of it."
      updated={UPDATED}
    >
      <LegalSection title="Who runs this site">
        <p>
          This site is the portfolio of {profile.name}, a software engineer
          based in {profile.location}. Questions about this policy go to {email}
          .
        </p>
      </LegalSection>

      <LegalSection title="What the site collects">
        <ul>
          <li>
            <strong>No accounts and no stored messages.</strong> The contact
            form doesn&apos;t send anything to this site. It opens a pre-filled
            email in your own mail app (or Gmail or Outlook, if you choose), and
            you decide whether to send it.
          </li>
          <li>
            <strong>No cookies, analytics, or advertising trackers.</strong>{" "}
            Fonts and scripts are served from this site, not from third-party
            CDNs.
          </li>
          <li>
            <strong>One preference in your browser.</strong> Your theme choice
            (light or dark), and your animation preference if you pause
            animations, are kept in your browser&apos;s local storage. They
            never leave your device; clear your site data to remove them.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Hosting">
        <p>
          The site is hosted on Vercel. Like any web host, Vercel processes
          standard request data, such as your IP address, browser, and the pages
          requested, to deliver the site and protect it from abuse. See{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Vercel&apos;s privacy policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="When you contact me">
        <p>
          If you email me or message me on WhatsApp, I receive what you send and
          use it only to reply and to discuss the role or project you wrote
          about. I don&apos;t sell it, share it, or add you to a mailing list.
          Ask at {email} and I&apos;ll delete our correspondence.
        </p>
      </LegalSection>

      <LegalSection title="Other sites">
        <p>
          Links to GitHub, LinkedIn, X, WhatsApp, and live project demos take
          you to sites with their own privacy policies. Live demos are separate
          apps; read their own notices before signing up to one.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If the site starts collecting anything new, this page will say so
          first, and the date at the top will change.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
