import { ArrowLeft, FolderGit2 } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Page not found",
  // Next already emits `noindex` for not-found responses.
};

// Root 404 sits outside the (site) group, so it brings the chrome itself.
export default function NotFound() {
  return (
    <SiteChrome>
      <Container className="flex min-h-[60dvh] flex-col items-start justify-center gap-6 py-20">
        <p className="font-mono text-sm text-secondary-strong">
          <span className="text-muted-foreground">$</span> GET {"<this page>"}
          <span className="ml-2 rounded-md bg-error/15 px-2 py-0.5 text-error">
            404
          </span>
        </p>
        <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] leading-tight font-bold tracking-tight">
          This page <span className="text-gradient">doesn&apos;t exist.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          The link may be old, or the address mistyped. The projects and the
          homepage are still where you left them.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            <ArrowLeft aria-hidden="true" /> Back to home
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline" size="lg">
            <FolderGit2 aria-hidden="true" /> Browse projects
          </ButtonLink>
        </div>
      </Container>
    </SiteChrome>
  );
}
