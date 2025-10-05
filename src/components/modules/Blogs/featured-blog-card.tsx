"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedBlogCardProps {
  image?: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  createdAt: string;
  publisher: string;
  publisherAvatar?: string;
  slug: string;
}

export function FeaturedBlogCard({
  image,
  title,
  description,
  tags,
  category,
  createdAt,
  publisher,
  publisherAvatar,
  slug,
}: FeaturedBlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left side - Image */}
          <Link
            href={`/blog/${slug}`}
            className="relative h-64 md:h-full overflow-hidden group"
          >
            <Image
              src={image || "/placeholder.svg?height=400&width=600"}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-4 left-4 z-10">{category}</Badge>
          </Link>

          {/* Right side - Content */}
          <div className="p-6 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <Link href={`/blog/${slug}`} className="group">
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors text-balance">
                {title}
              </h3>
            </Link>

            <p className="text-muted-foreground mb-4 line-clamp-3 text-pretty">
              {description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mt-auto">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={publisherAvatar || "/placeholder.svg"}
                    alt={publisher}
                  />
                  <AvatarFallback>{publisher.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{publisher}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={createdAt}>
                      {new Date(createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href={`/blog/${slug}`}>Read More</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
