"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  const session = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
          : "h-24 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <NavigationSheet />
          </div>
          <Link href="/" className="group flex items-center gap-3">
            <Logo />
            <div className="flex flex-col -space-y-1">
              <span className="text-base sm:text-lg font-extrabold tracking-tight group-hover:text-primary transition-colors">
                Md Abdul <span className="text-primary italic">Mamun</span>
              </span>
              <span className="hidden xs:block text-[9px] sm:text-[10px] font-bold text-muted-foreground tracking-[0.1em] uppercase">
                Frontend Developer
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavMenu />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {session.status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="hidden md:flex rounded-2xl border-2 font-bold h-10 px-6 transition-all hover:bg-primary hover:text-white"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Link
                href="/dashboard"
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20"
              >
                <LayoutDashboard size={20} />
              </Link>
            </div>
          ) : (
            <Button
              asChild
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 px-8 shadow-xl shadow-primary/20 hidden sm:flex"
            >
              <Link href="/contact-me">Hire Me</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
