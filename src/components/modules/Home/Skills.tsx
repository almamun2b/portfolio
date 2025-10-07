// components/Skills.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Code2,
  Gauge,
  Palette,
  Server,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Frontend Web Development",
    description:
      "Specialized in building modern, fast, and responsive web applications using TypeScript, JavaScript, HTML5, CSS3, React.js, Next.js, Nuxt.js, and Astro.js with TailwindCSS.",
  },
  {
    icon: Server,
    title: "Backend Development",
    description:
      "Proficient in building scalable and secure backend applications using Node.js and Express.js. Experienced with MongoDB (Mongoose) and PostgreSQL (Prisma)",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Development",
    description:
      "Crafting responsive and mobile-first designs ensuring smooth experiences across all devices.",
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    description:
      "Optimizing applications for speed, SEO, and user experience through best practices and clean architecture.",
  },
  {
    icon: Palette,
    title: "User-Centric Design",
    description:
      "Focused on creating interfaces that are both functional and visually appealing with attention to usability.",
  },
  {
    icon: ShieldCheck,
    title: "Testing & Quality Assurance",
    description:
      "Ensuring bug-free and secure applications using unit testing, integration testing, and debugging tools.",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-6">
      <div className="container mx-auto text-center max-w-4xl mb-12">
        <h2 className="text-3xl font-bold mb-4">My Skills</h2>
        <p className="text-muted-foreground">
          I`m not just a developer; I build seamless digital experiences.
          Discover how I can help you with modern, scalable solutions.
        </p>
      </div>

      <div className="container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, idx) => (
          <Card
            key={idx}
            className="rounded-2xl border bg-background hover:shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <skill.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{skill.title}</h3>
              <p className="text-sm text-muted-foreground">
                {skill.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
