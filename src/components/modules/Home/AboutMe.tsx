"use client";

import mamun from "@/assets/mamun.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, MapPin, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const details = [
  { icon: User2, label: "Role", value: "Frontend Developer" },
  { icon: Calendar, label: "Experience", value: "3.5+ Years" },
  { icon: MapPin, label: "Location", value: "Sirajganj, Bangladesh" },
  { icon: CheckCircle2, label: "Status", value: "Available for Hire" },
];

export default function AboutMe() {
  return (
    <section id="about" className="py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center relative"
          >
            {/* Decorative background element */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full -z-10" />

            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
              <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-background aspect-4/5 w-full max-w-[420px]">
                <Image
                  src={mamun}
                  alt="Md Abdul Mamun"
                  width={420}
                  height={525}
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
              Get to know me
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              Crafting Digital <br />
              <span className="text-primary">Seamless Experiences</span>
            </h2>

            <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
              <p>
                I am a passionate{" "}
                <span className="text-foreground font-semibold">
                  Frontend Developer
                </span>{" "}
                with over{" "}
                <span className="text-foreground font-semibold">3.5 years</span>{" "}
                of professional experience building modern, performant, and
                scalable web applications.
              </p>
              <p>
                My core expertise lies in the React ecosystem, specifically{" "}
                <span className="text-foreground font-semibold">
                  Next.js, TypeScript, and Tailwind CSS
                </span>
                . I also have hands-on experience with Nuxt.js, Astro.js, and
                backend technologies like Node.js and MongoDB.
              </p>
            </div>

            {/* Quick Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-10">
              {details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-bold h-12"
                asChild
              >
                <Link href="/contact-me">Let&apos;s Talk</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 h-12 border-2 font-bold"
                asChild
              >
                <Link href="/mamun.pdf" target="_blank">
                  Download Resume
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
