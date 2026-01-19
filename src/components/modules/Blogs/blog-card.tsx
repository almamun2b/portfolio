"use client";

import mamun from "@/assets/mamun.png";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, Eye } from "lucide-react";
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col h-full bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border/50 overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden m-3 rounded-[1.8rem]">
        <Image
          src={image || mamun}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Modern Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
            <Eye className="text-white w-6 h-6" />
          </div>
        </div>

        <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-foreground border-none px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-lg">
          {category.name}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-8 pt-4 flex flex-col flex-1">
        {/* Meta Line */}
        <div className="flex items-center gap-6 mb-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-background shadow-sm">
              <Image
                src={author?.picture || mamun}
                alt={author?.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-bold tracking-tight text-foreground/80">
              {author?.name || "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-primary/60" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-extrabold mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
          {title}
        </h3>

        <p className="text-muted-foreground text-base leading-relaxed line-clamp-2 mb-8 flex-1">
          {description}
        </p>

        {/* Read More Section */}
        <div className="pt-6 border-t border-border/50">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-primary group/link"
          >
            Read Article
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="text-lg leading-none"
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
