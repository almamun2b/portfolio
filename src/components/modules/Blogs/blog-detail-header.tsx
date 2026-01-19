"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/types";
import { motion } from "framer-motion";
import { Calendar, Eye, User2 } from "lucide-react";

interface BlogDetailHeaderProps {
  blog: Blog & {
    publisher?: string;
    publisherAvatar?: string;
  };
}

export function BlogDetailHeader({ blog }: BlogDetailHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Category & Badge Row */}
      <div className="flex flex-wrap items-center gap-4">
        <Badge className="bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
          {blog.category.name}
        </Badge>
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
        <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest">
          <Calendar className="h-4 w-4 text-primary/60" />
          <span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-balance leading-[1.1]"
      >
        {blog.title}
      </motion.h1>

      {/* Author & Stats Block */}
      <div className="flex flex-wrap items-center justify-between gap-8 py-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl border-2 border-primary/20 p-0.5">
            <AvatarImage
              className="rounded-[0.7rem] object-cover"
              src={blog.author?.picture || "/placeholder.svg"}
              alt={blog.author?.name || "Author"}
            />
            <AvatarFallback className="rounded-2xl">
              <User2 className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
              WRITTEN BY
            </p>
            <p className="font-bold text-lg text-foreground">
              {blog.author?.name || "Md Abdul Mamun"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
              READ TIME
            </p>
            <p className="font-bold">5 min read</p>
          </div>
          <div className="w-px h-10 bg-border/50 hidden sm:block" />
          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl">
            <Eye size={18} className="text-primary" />
            <span className="font-bold text-sm tracking-tight">
              {blog.views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="flex flex-wrap gap-2 pt-2">
        {blog.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="bg-background/50 border-border/50 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:border-primary/50 transition-colors"
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
