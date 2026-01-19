"use client";

import HtmlRenderer from "@/components/shared/HtmlRenderer";
import { Project } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectDetailContentProps {
  project: Project;
}

const ProjectDetailContent = ({ project }: ProjectDetailContentProps) => {
  return (
    <div className="space-y-20">
      {/* Immersive Featured Image */}
      {project.image && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-16/10 lg:aspect-21/9 overflow-hidden rounded-3xl border border-border/50 group shadow-2xl"
        >
          <div className="relative w-full h-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            {/* Subtle Overlay to enhance visual depth */}
            <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>
      )}

      {/* Structured Content & Narratives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1000px] mx-auto"
      >
        <div className="prose prose-xl dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-[1.8] prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline max-w-none">
          <HtmlRenderer content={project.content} />
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetailContent;
