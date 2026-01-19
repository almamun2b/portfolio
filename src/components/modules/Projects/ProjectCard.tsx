"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
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
      transition={{ duration: 0.3 }}
      className="group relative h-full flex flex-col bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 flex items-center justify-center"
            asChild
          >
            <Link href={`/project/${slug}`}>
              <ExternalLink size={20} />
            </Link>
          </Button>
        </div>

        <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-none px-3 py-1 font-bold">
          {type}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.slice(0, 3).map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-wider font-bold"
            >
              {tech}
            </Badge>
          ))}
          {technologies.length > 3 && (
            <span className="text-[10px] text-muted-foreground self-center font-bold">
              +{technologies.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          className="w-full rounded-xl border-2 font-bold group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
          asChild
        >
          <Link href={`/project/${slug}`}>View Case Study</Link>
        </Button>
      </div>
    </motion.div>
  );
};
