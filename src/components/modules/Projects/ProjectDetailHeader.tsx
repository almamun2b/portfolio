"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Github, Layers } from "lucide-react";
import Link from "next/link";

interface ProjectDetailHeaderProps {
  project: Project;
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        {/* Categorization & Metadata */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge className="bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            {project.type}
          </Badge>
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
          <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest">
            <Calendar className="h-4 w-4 text-primary/60" />
            <span>
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-balance leading-[1.1]"
        >
          {project.title}
        </motion.h1>

        {/* Summary */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl"
        >
          {project.description}
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-end">
        {/* Technologies Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Layers size={20} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">
              Core Tech Stack
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="bg-background/50 border-border/50 text-sm font-bold px-4 py-2 rounded-xl hover:border-primary/50 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap gap-4 lg:justify-end pb-1"
        >
          {project.projectUrl && (
            <Button
              asChild
              size="lg"
              className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
            >
              <Link
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-5 w-5 mr-3" />
                Explore Live
              </Link>
            </Button>
          )}
          {project.codeUrl && (
            <Button
              variant="outline"
              size="lg"
              className="h-16 px-10 rounded-2xl border-2 font-bold hover:bg-muted transition-all"
              asChild
            >
              <Link
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5 mr-3" />
                Source Code
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
