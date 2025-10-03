"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";

type NavMenuProps = NavigationMenuProps & {
  onClickMenu?: () => void;
};

export const NavMenu = ({ onClickMenu, ...props }: NavMenuProps) => {
  const navMenus = [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about-me" },
    { label: "Projects", href: "/projects" },
    { label: "Blogs", href: "/blogs" },
  ];
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-6 space-x-0 gap-y-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start text-base font-medium">
        {navMenus.map((menu) => (
          <NavigationMenuItem key={menu.label}>
            <NavigationMenuLink asChild>
              <Link href={menu.href} onClick={onClickMenu}>
                {menu.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
