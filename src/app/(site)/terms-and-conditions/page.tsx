import { LegalPage, LegalSection } from "@/components/layout/legal-page";
import { pageMetadata } from "@/lib/metadata";
import { getProfile } from "@/server/dal/profile";

export const metadata = pageMetadata({
  title: "Terms and conditions",
  description:
    "Terms and conditions for this portfolio: who owns the content, how project work is shown, and the status of live demos and open-source code.",
  path: "/terms-and-conditions",
});

const UPDATED = "2026-10-21";

export default async function TermsPage() {
  const profile = await getProfile();
  return (
    <LegalPage
      path="terms-and-conditions"
      name="Terms and conditions"
      title="Terms and"
      highlight="conditions"
      description="The short version: read, share, and link freely; the work shown belongs to the people it was built for."
      updated={UPDATED}
    >
      <LegalSection title="Using this site">
        <p>
          You&apos;re welcome to read, link to, and share any page of this
          portfolio. Please don&apos;t copy its design, text, or images and
          present them as your own.
        </p>
      </LegalSection>

      <LegalSection title="Ownership">
        <ul>
          <li>
            The site&apos;s text, design, and code are &copy; {profile.name}{" "}
            unless stated otherwise.
          </li>
          <li>
            Project names, screenshots, and trademarks belong to their
            respective owners. Work built for employers or their clients is
            shown anonymized, without client or product names, and describes
            only my part in it.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Open-source code and live demos">
        <ul>
          <li>
            Public repositories linked from project pages are covered by their
            own licences (for example MIT). The licence file in each repository
            applies, not these terms.
          </li>
          <li>
            Live demos are portfolio examples, provided as-is with no warranty
            or uptime guarantee. Free-tier APIs can take a moment to wake up.
            Don&apos;t enter real personal or payment data into a demo.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="External links">
        <p>
          Links to other sites are provided for convenience. I don&apos;t
          control those sites and am not responsible for their content or
          policies.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms, or a request to take something down:{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
