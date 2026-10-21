import type { ReactNode } from "react";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { Container } from "./container";
import { PageHero } from "./page-hero";

/** Shared frame for /privacy-policy and /terms-and-conditions: hero, "last updated", and prose. */
export function LegalPage({
  path,
  name,
  title,
  highlight,
  description,
  updated,
  children,
}: {
  path: "privacy-policy" | "terms-and-conditions";
  /** Breadcrumb name, e.g. "Privacy policy". */
  name: string;
  title: string;
  highlight: string;
  description: string;
  /** ISO date (YYYY-MM-DD) the text last changed. */
  updated: string;
  children: ReactNode;
}) {
  const label = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(updated));
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name, path: `/${path}` },
            ]),
          ),
        }}
      />
      <PageHero
        path={path}
        title={title}
        highlight={highlight}
        description={description}
      >
        <p className="font-mono text-sm text-muted-foreground">
          Last updated <time dateTime={updated}>{label}</time>
        </p>
      </PageHero>
      <Container className="pb-16">
        <div className="flex max-w-3xl flex-col gap-10 rounded-3xl border border-border glass p-6 leading-relaxed text-muted-foreground sm:p-10">
          {children}
        </div>
      </Container>
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 [&_a]:rounded-sm [&_a]:font-medium [&_a]:text-primary-strong [&_a]:underline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-ring [&_a:hover]:underline [&_strong]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
      <h2 className="font-display text-xl font-bold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
