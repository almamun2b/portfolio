import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { getMainNav } from "@/server/modules/content/navigation.service";
import {
  getProfile,
  getSocials,
} from "@/server/modules/content/profile.service";
import { Container } from "./container";
import { Logo } from "./logo";
import { Suspense } from "react";
import { CurrentMainNav, CurrentMobileNav } from "./current-nav";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

/**
 * Sticky glass header (no top bar). Its scrolled state, a deeper fill and a
 * primary-tinted glow, is a CSS scroll-driven animation (`[data-site-header]` in
 * globals.css), so it costs no JavaScript.
 */
export async function SiteHeader() {
  const [profile, socials, nav] = await Promise.all([
    getProfile(),
    getSocials(),
    getMainNav(),
  ]);
  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b border-border bg-(--header) backdrop-blur-[28px] backdrop-saturate-150"
    >
      <Container className="flex h-[70px] items-center justify-between gap-4">
        <Logo />
        <Suspense fallback={<MainNav items={nav} pathname={null} />}>
          <CurrentMainNav items={nav} />
        </Suspense>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <ButtonLink
            href={profile.resume.href}
            download={profile.resume.fileName}
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Download aria-hidden="true" /> Download CV
          </ButtonLink>
          <Suspense
            fallback={
              <MobileNav
                items={nav}
                socials={socials}
                resume={profile.resume}
                pathname={null}
              />
            }
          >
            <CurrentMobileNav
              items={nav}
              socials={socials}
              resume={profile.resume}
            />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}
