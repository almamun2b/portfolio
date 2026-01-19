"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  const session = useSession();
  return (
    <nav className="fixed h-14 w-full bg-background border dark:border-slate-700/70 z-50">
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <NavigationSheet />
          </div>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <NavMenu className="hidden md:block" />

        {/* Actions and Mobile Menu */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          {session.status === "authenticated" && (
            <>
              <Button
                asChild
                className="rounded-full px-2 py-2 text-sm md:text-base  hidden md:flex"
              >
                <Link href="/dashboard" className="w-full text-center">
                  Dashboard
                </Link>
              </Button>
              <Link
                href="/dashboard"
                className="rounded-full px-2 py-2 text-sm md:text-base md:hidden"
              >
                <LayoutDashboard />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
