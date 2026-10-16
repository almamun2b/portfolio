"use client";

import { Badge } from "@/components/ui/badge";

export const Skills = () => {
  const frontend = [
    "React.js",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "TailwindCSS",
    "Astro.js",
  ];
  const backend = [
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "Prisma",
    "PostgreSQL",
  ];
  const tools = ["Git", "GitHub", "Docker", "VS Code", "Vite"];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold mb-6">Skills</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium mb-3">Frontend</h3>
          <div className="flex flex-wrap gap-2">
            {frontend.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-3">Backend</h3>
          <div className="flex flex-wrap gap-2">
            {backend.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-3">Tools</h3>
          <div className="flex flex-wrap gap-2">
            {tools.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
