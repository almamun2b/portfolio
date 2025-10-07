"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "All Projects", href: "/projects" },
      { name: "All Blogs", href: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "About Me", href: "/about-me" },
      { name: "Contact", href: "/contact-me" },
      { name: "Resume", href: "/mamun.pdf" },
    ],
  },
];
const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com/", icon: Twitter },
  { name: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="container mx-auto py-12 px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          {/* Logo & description */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              Md Abdul Mamun
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto md:mx-0">
              Software Engineer | Frontend-Focused Full Stack Developer.
              Passionate about building performant and scalable web
              applications.
            </p>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <link.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Dynamic Links */}
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-10 text-center md:text-left">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="hover:text-foreground">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-border pt-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Md Abdul Mamun. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
