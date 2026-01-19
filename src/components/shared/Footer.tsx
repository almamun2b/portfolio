"use client";

import { motion } from "framer-motion";
import {
    Facebook,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Twitter
} from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { name: "About Me", href: "/#about" },
      { name: "Skills", href: "/#skills" },
      { name: "Projects", href: "/projects" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Contact Me", href: "/contact-me" },
      { name: "Resume", href: "/mamun.pdf" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
];

const socialLinks = [
  { name: "Github", href: "https://github.com/almamun2b", icon: Github },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/almamun2b",
    icon: Linkedin,
  },
  { name: "Twitter", href: "https://twitter.com/almamun2b", icon: Twitter },
  { name: "Facebook", href: "https://facebook.com/almamun2b", icon: Facebook },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-card/30 border-t border-border mt-12 overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto py-20 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Logo & Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Md Abdul <span className="text-primary">Mamun</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Crafting high-performance digital experiences with precision and
                passion. Let&apos;s build something great together.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-default">
                <MapPin size={20} className="text-primary" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-default">
                <Mail size={20} className="text-primary" />
                <span>almamun2b@gmail.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ y: -5 }}>
                  <Link
                    href={link.href}
                    target="_blank"
                    className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    <link.icon size={20} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-12">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Md Abdul Mamun. Built with ❤️ and
            Next.js.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
