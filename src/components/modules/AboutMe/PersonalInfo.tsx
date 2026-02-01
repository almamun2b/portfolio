"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    User2,
} from "lucide-react";
import Link from "next/link";

const infoItems = [
  { icon: User2, label: "Name", value: "Md Abdul Mamun" },
  {
    icon: Mail,
    label: "Email",
    value: "almamun2b@gmail.com",
    href: "mailto:almamun2b@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1610 088 700",
    href: "tel:+8801610088700",
  },
  { icon: MapPin, label: "Location", value: "Sirajganj, Bangladesh" },
  { icon: Calendar, label: "Age", value: "32 Years" },
  { icon: Globe, label: "Website", value: "mamun.dev", href: "/" },
];

const socialItems = [
  { icon: Github, label: "GitHub", href: "https://github.com/almamun2b" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/almamun2b",
  },
];

export const PersonalInfo = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 grid sm:grid-cols-2 gap-6"
          >
            {infoItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm flex items-center gap-5 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <item.icon size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-base font-semibold hover:text-primary transition-colors"
                    >
                      {item.value}
                    </Link>
                  ) : (
                    <p className="text-base font-semibold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Social & Status Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="p-8 rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6">Social Presence</h3>
              <div className="flex flex-col gap-4">
                {socialItems.map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    target="_blank"
                    className="flex items-center justify-between p-4 rounded-2xl bg-background hover:bg-primary hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <social.icon size={20} />
                      <span className="font-semibold">{social.label}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="group-hover:bg-white group-hover:text-primary transition-colors"
                    >
                      Follow
                    </Badge>
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Status
                    </span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 px-4 py-1">
                    Available for Projects
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={24} className="text-primary" />
                <h3 className="font-bold">Hiring Ready</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Open to full-time opportunities or high-impact contract work in
                Frontend & Full-Stack development.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
