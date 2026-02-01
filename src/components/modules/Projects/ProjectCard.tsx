"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ProjectCard: React.FC<Project> = ({
  image,
  title,
  type,
  description,
  technologies,
  slug,
}) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative h-full flex flex-col bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border/40 overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_50px_-12px_rgba(var(--primary-rgb),0.15)] dark:hover:shadow-[0_20px_50px_-12px_rgba(var(--primary-rgb),0.2)] transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-16/10 overflow-hidden m-3 rounded-[1.8rem]">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        )}

        {/* Modern Hover Overlay */}
        <Link href={`/project/${slug}`} className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
            <Eye className="text-white w-7 h-7" />
          </div>
        </Link>

        <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-foreground border-none px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-lg">
          {type}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-extrabold group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>
          <Link href={`/project/${slug}`} className="text-muted-foreground w-6 h-6 shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
            <ArrowUpRight className="text-muted-foreground w-6 h-6" />
          </Link>
        </div>

        <p className="text-muted-foreground text-base leading-relaxed line-clamp-2 mb-8 flex-1">
          {description}
        </p>

        {/* Tech Stack Highlights */}
        <div className="flex flex-wrap gap-2 mb-8">
          {technologies.slice(0, 3).map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg"
            >
              {tech}
            </Badge>
          ))}
          {technologies.length > 3 && (
            <span className="text-[10px] text-muted-foreground/60 self-center font-bold tracking-widest pl-1">
              +{technologies.length - 3} MORE
            </span>
          )}
        </div>

        {/* Unified Action */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-border/50 font-extrabold text-sm uppercase tracking-widest group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.4)] transition-all duration-300"
          asChild
        >
          <Link href={`/project/${slug}`}>View Case Study</Link>
        </Button>
      </div>
    </motion.div>
  );
};
