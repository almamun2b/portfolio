"use client";

import type React from "react";

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

interface BlogCardProps {
  image?: string;
  title: string;
  description: string;
  tags?: string[];
  category: string;
  createdAt: string;
  publisher: string;
  publisherAvatar?: string;
  slug: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  image = "/images/mamun.png",
  title,
  description,
  tags = [],
  category,
  createdAt,
  publisher,
  publisherAvatar = "/images/mamun.png",
  slug,
}) => {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 py-0 gap-0">
      {/* Project / Blog Image */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg ">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge variant="secondary" className="absolute top-4 right-4">
          {category}
        </Badge>
      </div>

      {/* Header with Title, Publisher, Date, Category */}
      <CardHeader className="p-5 space-y-3">
        <CardTitle className="text-lg">{title}</CardTitle>

        {/* Publisher info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={publisherAvatar}
                alt={publisher}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {publisher}
            </p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {createdAt}
          </p>
        </div>
      </CardHeader>

      {/* Content with description and tags */}
      <CardContent className="px-5 pb-4 flex-1">
        <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* Footer with Details Button */}
      <CardFooter className="px-5 pb-5">
        <Button variant="outline" className="w-full bg-transparent">
          <Link href={`/blog/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
