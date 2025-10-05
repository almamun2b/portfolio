import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/types";
import { Calendar, Eye, User } from "lucide-react";

interface BlogDetailHeaderProps {
  blog: Blog & {
    publisher?: string;
    publisherAvatar?: string;
  };
}

export function BlogDetailHeader({ blog }: BlogDetailHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Category Badge */}
      <Badge variant="secondary" className="text-sm">
        {blog.category.name}
      </Badge>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
        {blog.title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={blog.author?.picture || "/placeholder.svg"}
              alt={blog.author?.name || "Author"}
            />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">
            {blog.author?.name || "Unknown Author"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{blog.views.toLocaleString()} views</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {blog.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
