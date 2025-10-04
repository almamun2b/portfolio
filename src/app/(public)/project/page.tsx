"use client";

import { ProjectCard } from "@/components/modules/Projects/ProjectCard";
import PaginationCommon from "@/components/shared/Pagination";
import Link from "next/link";

interface Project {
  image: string;
  title: string;
  type: "Frontend" | "Backend" | "Full Stack";
  description: string;
  techUsed?: string[];
  detailsLink: string;
}

const projects: Project[] = [
  {
    image: "/images/mamun.png",
    title: "Library Management System",
    type: "Backend",
    description:
      "Full-featured system with book borrowing, aggregation pipelines, and Mongoose middleware.",
    techUsed: ["Express.js", "TypeScript", "MongoDB", "Mongoose"],
    detailsLink: "/projects/library",
  },
  {
    image: "/images/mamun.png",
    title: "Digital Wallet API",
    type: "Backend",
    description:
      "Backend service with role-based authorization, wallet transactions, and authentication.",
    techUsed: ["Node.js", "Express.js", "MongoDB", "Mongoose"],
    detailsLink: "/projects/digital-wallet",
  },
  {
    image: "/images/mamun.png",
    title: "Portfolio Website",
    type: "Frontend",
    description:
      "Personal portfolio with resume builder, dynamic content, and NextAuth authentication.",
    techUsed: ["Next.js", "TailwindCSS", "React.js", "NextAuth"],
    detailsLink: "/projects/portfolio",
  },
  {
    image: "/images/mamun.png",
    title: "E-Commerce Platform",
    type: "Full Stack",
    description: "Full-stack e-commerce website with Stripe integration.",
    techUsed: ["Next.js", "Prisma", "TailwindCSS", "Stripe"],
    detailsLink: "/projects/ecommerce",
  },
  {
    image: "/images/mamun.png",
    title: "Blog CMS",
    type: "Frontend",
    description:
      "Dynamic blog using Astro.js with Markdown support and SEO optimizations.",
    techUsed: ["Astro.js", "Markdown", "TailwindCSS", "SEO"],
    detailsLink: "/projects/blog",
  },
  {
    image: "/images/mamun.png",
    title: "Admin Dashboard",
    type: "Frontend",
    description:
      "Interactive dashboard for analytics using Nuxt.js, Vuetify, and Chart.js.",
    techUsed: ["Nuxt.js", "Vuetify", "Chart.js", "TailwindCSS"],
    detailsLink: "/projects/dashboard",
  },
];

const ProjectPage: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 pt-32">
      <h2 className="text-3xl font-bold mb-4 text-center">My Projects</h2>
      <p className="text-muted-foreground mb-10 text-center">
        Here are some of the projects I`ve worked on. You can check out more on
        my{" "}
        <Link href="/projects" className="text-primary hover:underline">
          Projects
        </Link>{" "}
        page.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <PaginationCommon currentPage={1} totalPages={3} />
      </div>
    </section>
  );
};

export default ProjectPage;
