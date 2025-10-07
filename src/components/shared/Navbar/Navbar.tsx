"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  const session = useSession();
  return (
    <nav className="fixed h-14 w-full bg-background border dark:border-slate-700/70 z-30">
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <NavigationSheet />
          </div>
          <Link href="/" className="flex-shrink-0 ">
            <Logo />
          </Link>
        </div>

        <NavMenu className="hidden md:block" />

        {/* Actions and Mobile Menu */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          {session.status === "authenticated" ? (
            <Button
              asChild
              className="rounded-full px-5 py-2 text-sm md:text-base"
            >
              <Link href="/dashboard" className="block w-full text-center">
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-full px-5 py-2 text-sm md:text-base"
            >
              <Link href="/login" className="block w-full text-center">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
