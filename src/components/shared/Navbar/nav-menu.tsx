"use client";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavMenuProps = NavigationMenuProps & {
  onClickMenu?: () => void;
};

export const NavMenu = ({ onClickMenu, ...props }: NavMenuProps) => {
  const pathname = usePathname();

  const navMenus = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/project" },
    { label: "Journal", href: "/blog" },
    { label: "About", href: "/about-me" },
    { label: "Contact", href: "/contact-me" },
  ];

  const isActiveRoute = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-2 text-sm font-bold uppercase tracking-widest">
        {navMenus.map((menu) => {
          const isActive = isActiveRoute(menu.href);
          return (
            <NavigationMenuItem key={menu.label}>
              <NavigationMenuLink
                asChild
                className={cn(
                  "relative px-4 py-2 transition-colors duration-300 rounded-xl hover:text-primary",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/80 hover:bg-muted/50",
                )}
                data-active={isActive}
              >
                <Link
                  href={menu.href}
                  onClick={onClickMenu}
                  className="flex flex-col items-center"
                >
                  <span>{menu.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-2 right-2 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
