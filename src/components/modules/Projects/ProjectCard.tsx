"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  image: string;
  title: string;
  type: "Frontend" | "Backend" | "Full Stack";
  description: string;
  techUsed?: string[];
  detailsLink: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  type,
  description,
  techUsed = [],
  detailsLink,
}) => {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 py-0 gap-0">
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <CardHeader className="p-5">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Badge variant="secondary" className="mt-2">
          {type}
        </Badge>
      </CardHeader>

      <CardContent className="px-5 pb-4 flex-1">
        <p className="text-gray-700 dark:text-gray-300 mb-3">{description}</p>

        {techUsed.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techUsed.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-5">
        <Button variant="outline" asChild className="w-full">
          <Link href={detailsLink}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
