"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

const experiences = [
  {
    company: "Xubitar",
    role: "Full Stack Engineer",
    period: "July 2026 – Present",
    techStack: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "Prisma",
      "PostgreSQL",
      "Shopify APIs",
    ],
    contributions: [
      "Design, develop, and maintain production-grade eCommerce web applications using React.js, Next.js, Express.js, Node.js, Prisma, and PostgreSQL.",
      "Build and maintain Shopify-based eCommerce applications using the Shopify Admin API, Storefront API, and webhooks.",
      "Build inventory management systems with stock tracking, low-stock alerts, purchase/sales flows, and reporting.",
      "Build scalable backend services and RESTful APIs with a focus on performance, security, and maintainability.",
      "Own ongoing maintenance, bug fixes, and performance optimization for live eCommerce applications.",
    ],
  },
  {
    company: "Developer eXperience Hub (Devxhub)",
    role: "Software Engineer",
    period: "March 2022 – February 2026",
    techStack: [
      "Nuxt.js",
      "Next.js",
      "React",
      "Vue",
      "TypeScript",
      "TailwindCSS",
    ],
    contributions: [
      "Designed, developed, and maintained production-grade web applications using Nuxt.js, Next.js, React, Vue, and TypeScript.",
      "Delivered user-facing features across a Social Media Archiving System, Learning Management Systems (LMS), and eCommerce platforms.",
      "Implemented REST API integrations covering contracts, auth, error handling, and data fetching.",
      "Implemented scalable state management with Redux, Pinia, and Vuex.",
      "Built responsive, accessible, and SEO-optimized user interfaces with a focus on Core Web Vitals and rendering performance.",
      "Collaborated in Agile workflows — stand-ups, sprint planning, and peer code reviews.",
    ],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block"
          >
            Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Professional <span className="text-primary">Experience</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Over 4 years of experience crafting scalable, secure, and
            high-performance web applications — from eCommerce and Shopify apps
            to LMS and archiving platforms.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2 hidden sm:block" />

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10 hidden sm:block" />

                {/* Content Card */}
                <div className="md:w-1/2">
                  <div className="p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        <p className="text-primary font-semibold text-sm">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-6">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {exp.contributions.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-balance">
                          <CheckCircle2
                            size={16}
                            className="text-primary shrink-0 mt-0.5"
                          />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
