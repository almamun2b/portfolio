"use client";

import { motion, Variants } from "framer-motion";
import {
  Code2,
  Cpu,
  Database,
  Globe,
  Layout,
  Rocket,
  Server,
  Zap
} from "lucide-react";

const technologies = [
  { name: "Nuxt.js", icon: Zap, color: "text-green-500" },
  { name: "Next.js", icon: Zap, color: "text-black dark:text-white" },
  { name: "React", icon: Layout, color: "text-blue-500" },
  { name: "TypeScript", icon: Code2, color: "text-blue-600" },
  { name: "Tailwind CSS", icon: Globe, color: "text-sky-400" },
  { name: "Astro.js", icon: Rocket, color: "text-orange-500" },
  { name: "Node.js", icon: Server, color: "text-green-600" },
  { name: "PostgreSQL", icon: Database, color: "text-indigo-400" },
  { name: "MongoDB", icon: Database, color: "text-green-500" },
  { name: "Express", icon: Cpu, color: "text-gray-500" },
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function TechStack() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight"
          >
            My <span className="text-primary">Tech Stack</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground"
          >
            I leverage the latest tools and frameworks to build
            high-performance, accessible, and scalable digital products.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                backgroundColor: "var(--background)",
                boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
              }}
              className="flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border bg-card/50 backdrop-blur-sm transition-colors duration-300 group"
            >
              <div
                className={`p-3 md:p-4 rounded-xl bg-background shadow-sm mb-4 group-hover:shadow-md transition-shadow`}
              >
                <tech.icon className={`w-6 h-6 md:w-8 md:h-8 ${tech.color}`} />
              </div>
              <span className="font-semibold text-xs md:text-base">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
