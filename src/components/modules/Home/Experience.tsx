"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

const experiences = [
  {
    company: "Devxhub",
    role: "Software Engineer",
    period: "March 2022 – Present",
    techStack: ["Nuxt.js", "Next.js", "Astro.js", "TypeScript", "TailwindCSS"],
    contributions: [
      "Developed and maintained production-grade web applications for clients across multiple domains.",
      "Built responsive and accessible user interfaces with a focus on UX, performance, and SEO.",
      "Collaborated with backend teams to integrate RESTful APIs and improve system performance.",
      "Migrated projects from Nuxt 2 → Nuxt 3, ensuring smooth transitions.",
      "Conducted code reviews and optimized build pipelines for better maintainability.",
    ],
  },
  {
    company: "Self-Driven",
    role: "Personal Projects & Continuous Learning",
    period: "Ongoing",
    techStack: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express",
      "Mongoose",
      "Prisma",
    ],
    contributions: [
      "Library Management System: Built a complete platform with borrowing workflows and admin dashboards.",
      "Digital Wallet System: Developed secure wallet APIs with RBAC and transaction validation.",
      "Tour Management System: Created an end-to-end booking solution with analytics and React frontend.",
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
            Over 3.5 years of experience in crafting high-performance web
            applications and leading technical migrations.
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
