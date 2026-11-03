import { cn } from "cn";
import Link from "next/link";
import type { NavItem } from "@/content/navigation";

export function isActive(pathname: string | null, href: string) {
  if (pathname === null || href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Desktop navigation: a glass pill with the current page outlined. It takes
 * the pathname as a prop (null renders no active item), so the server can
 * render it as the Suspense fallback of <CurrentMainNav> for routes whose
 * URL isn't known until request time.
 */
export function MainNav({
  items,
  pathname,
}: {
  items: readonly NavItem[];
  pathname: string | null;
}) {
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1 rounded-full border border-border glass p-1.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-[color,background-color,box-shadow] duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active
                    ? "bg-primary/12 text-foreground shadow-[inset_0_0_0_1.5px_var(--primary),0_0_14px_color-mix(in_srgb,var(--primary)_25%,transparent)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
