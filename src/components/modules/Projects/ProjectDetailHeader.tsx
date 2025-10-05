import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { Calendar, ExternalLink, Github } from "lucide-react";
import Link from "next/link";

interface ProjectDetailHeaderProps {
  project: Project;
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Project Type Badge */}
      <Badge variant="secondary" className="text-sm">
        {project.type}
      </Badge>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
        {project.title}
      </h1>

      {/* Description */}
      <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl">
        {project.description}
      </p>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Technologies Used</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        {project.projectUrl && (
          <Button asChild size="lg">
            <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Demo
            </Link>
          </Button>
        )}
        {project.codeUrl && (
          <Button variant="outline" size="lg" asChild>
            <Link href={project.codeUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              View Code
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
