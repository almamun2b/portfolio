"use client";

import mamun from "@/assets/mamun.png";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

interface BlogCardProps {
  image?: string | null;
  title: string;
  description: string;
  tags?: string[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  createdAt: string | Date;
  author?: {
    id: number;
    name: string;
    email: string;
    picture?: string | null;
  };
  slug: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  image,
  title,
  description,
  category,
  createdAt,
  author,
  slug,
}) => {
  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={image || mamun}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Badge className="absolute top-4 right-4 bg-primary text-white border-none px-3 py-1 font-bold">
          {category.name}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-background shadow-sm">
              <Image
                src={author?.picture || mamun}
                alt={author?.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-foreground/80">
              {author?.name || "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {description}
        </p>

        {/* Action Link */}
        <div className="pt-4 border-t border-border/50">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all duration-300"
          >
            Read More
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
