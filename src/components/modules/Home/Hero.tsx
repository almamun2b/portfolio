"use client";

import mamun2 from "@/assets/mamun2.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Experiences", value: "3.5+" },
  { label: "Project done", value: "30+" },
  { label: "Happy Clients", value: "20+" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/almamun2b" },
  { icon: Linkedin, href: "https://linkedin.com/in/almamun2b" },
  { icon: Twitter, href: "https://twitter.com/almamun2b" },
  { icon: Mail, href: "mailto:almamun2b@gmail.com" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-between py-24 lg:py-32 overflow-hidden">
      {/* Background Decorative Circle */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 hidden lg:block" />

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 w-full">
        {/* Left Content */}
        <div className="w-full lg:w-3/5 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-base md:text-lg font-medium text-muted-foreground mb-2 block">
              Hi I am
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Md Abdul Mamun
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8 text-primary uppercase leading-[1.1]">
              Frontend <br /> <span className="text-foreground">Developer</span>
            </h1>

            {/* Social Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-10">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-muted transition-colors duration-300"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-16">
              <Button
                size="lg"
                asChild
                className="rounded-xl px-10 bg-primary hover:bg-primary/90 text-white font-bold h-14"
              >
                <Link href="mailto:almamun2b@gmail.com">Hire Me</Link>
              </Button>

              <Button
                size="lg"
                asChild
                variant="outline"
                className="rounded-xl px-10 h-14 border-2 font-bold"
              >
                <Link href="/resume.pdf" target="_blank">
                  <Download className="mr-2 h-5 w-5" /> Download CV
                </Link>
              </Button>
            </div>

            {/* Stats Integration */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 rounded-3xl bg-card border shadow-sm max-w-2xl mx-auto lg:mx-0">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col border-r last:border-0 border-border"
                >
                  <span className="text-2xl md:text-3xl font-black text-primary mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-2/5 flex justify-center items-end relative min-h-[450px] sm:min-h-[550px] lg:min-h-[650px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group w-full flex justify-center px-4"
          >
            {/* Main Background Circle */}
            <div className="absolute bottom-0 w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full bg-background -z-10" />

            {/* Decorative Glow */}
            <div className="absolute bottom-0 w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] bg-primary/5 rounded-full blur-3xl -z-20" />

            {/* Masked Image Container */}
            <div className="relative w-[240px] h-[400px] sm:w-[420px] sm:h-[580px] lg:w-[500px] lg:h-[650px] overflow-hidden rounded-b-full flex items-end">
              <Image
                src={mamun2}
                alt="Md Abdul Mamun"
                fill
                className="object-contain object-bottom scale-90 sm:scale-95 filter grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
