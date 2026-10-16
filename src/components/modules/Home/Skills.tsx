"use client";

import { motion, Variants } from "framer-motion";
import { Code2, Cpu, Globe, Layout, Rocket, ShieldCheck } from "lucide-react";

const skills = [
  {
    icon: Layout,
    title: "Frontend Development",
    subtitle: "Modern & Responsive UI",
    description:
      "Expertise in building high-performance, pixel-perfect interfaces using React, Next.js, and Tailwind CSS. Focused on user experience and accessibility.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Cpu,
    title: "Backend Engineering",
    subtitle: "Scalable & Secure Logic",
    description:
      "Architecting robust server-side solutions with Node.js, Express, and databases like PostgreSQL and MongoDB. Ensuring seamless data flow.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Globe,
    title: "Full-Stack Integration",
    subtitle: "Complete Digital Solutions",
    description:
      "Bridging the gap between frontend and backend to deliver comprehensive web applications that are fast, reliable, and easy to maintain.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Rocket,
    title: "Performance Optimization",
    subtitle: "Lightning Fast Speed",
    description:
      "Boosting application performance through code splitting, caching strategies, and efficient asset management to ensure top-tier rankings.",
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500",
  },
  {
    icon: Code2,
    title: "Clean Architecture",
    subtitle: "Maintainable Codebases",
    description:
      "Writing clean, modular, and well-documented code following SOLID principles and best practices for long-term scalability and collaboration.",
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    subtitle: "Reliable & Bug-Free",
    description:
      "Implementing comprehensive testing strategies and security best practices to protect user data and ensure application stability.",
    gradient: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-500",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block"
          >
            Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight"
          >
            My Expertise in <span className="text-primary">Development</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            I deliver end-to-end digital solutions that combine aesthetic
            excellence with technical precision.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative p-10 rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-md hover:border-primary/40 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Card Gradient Background */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${skill.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10 flex flex-col items-start">
                <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                  <skill.icon className={`w-8 h-8 ${skill.iconColor}`} />
                </div>

                <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-3">
                  {skill.subtitle}
                </span>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">
                  {skill.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground transition-colors duration-500">
                  {skill.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
