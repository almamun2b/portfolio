"use client";

import { cn } from "cn";
import { ArrowUpRight, Download, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SocialIcon } from "@/components/icons/social-icon";
import { IconButton } from "@/components/ui/button";
import { ButtonLink, type AssetPath } from "@/components/ui/button-link";
import { Sheet } from "@/components/ui/dialog";
import type { NavItem } from "@/content/navigation";
import type { Social } from "@/lib/schemas/content";
import { isActive } from "./main-nav";

/** Below `lg`: a menu button that opens the navigation in a side sheet. */
export function MobileNav({
  items,
  socials,
  resume,
}: {
  items: readonly NavItem[];
  socials: Social[];
  resume: { href: AssetPath; fileName: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => {
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <IconButton
        label="Open menu"
        variant="outline"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Menu aria-hidden="true" />
      </IconButton>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Menu"
        panelClassName="bg-popover/95 backdrop-blur-xl"
      >
        <nav aria-label="Main" className="flex h-full flex-col gap-8">
          <ul className="flex flex-col gap-1.5">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-13 items-center justify-between rounded-2xl border px-5 font-display text-lg font-semibold transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      active
                        ? "border-primary bg-primary/12 text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border-strong hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 opacity-60"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto flex flex-col gap-5">
            <ButtonLink
              href={resume.href}
              download={resume.fileName}
              size="lg"
              className="w-full"
            >
              <Download aria-hidden="true" /> Download CV
            </ButtonLink>
            <ul className="flex justify-center gap-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="grid size-11 place-items-center rounded-xl border border-border-strong bg-muted text-muted-foreground transition-colors hover:bg-gradient-button hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <SocialIcon id={social.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </Sheet>
    </div>
  );
}
