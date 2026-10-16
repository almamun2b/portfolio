"use client";

import { Badge } from "@/components/ui/badge";

export const Skills = () => {
  const frontend = [
    "React.js",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "Astro.js",
    "TailwindCSS",
    "Shadcn UI",
    "Vuetify",
  ];
  const backend = [
    "Node.js",
    "Express.js",
    "REST APIs",
    "Shopify Admin API",
    "Storefront API",
    "Webhooks",
    "MongoDB (Mongoose)",
    "PostgreSQL (Prisma)",
  ];
  const stateManagement = [
    "Redux",
    "RTK Query",
    "TanStack Query",
    "Zustand",
    "Pinia",
    "Vuex",
  ];
  const tools = ["TypeScript", "Git", "GitHub", "Vite", "ESLint", "Prettier"];

  const groups = [
    { title: "Frontend", items: frontend, variant: "default" as const },
    { title: "Backend & Database", items: backend, variant: "secondary" as const },
    { title: "State Management", items: stateManagement, variant: "default" as const },
    { title: "Languages & Tools", items: tools, variant: "outline" as const },
  ];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold mb-6">Skills</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="font-medium mb-3">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <Badge key={skill} variant={group.variant}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
