import { cn } from "cn";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatLongDate } from "@/lib/format";
import type { PostSummary } from "@/server/modules/content/posts.service";
import { PostCover } from "./post-cover";

/** Card linking to a post. The title link stretches over the card. */
export function PostCard({
  post,
  headingLevel = 2,
  className,
}: {
  post: PostSummary;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={cn(
        "group relative isolate flex flex-col gap-5 overflow-hidden rounded-3xl border border-border glass p-3 pb-6",
        "transition-[translate,box-shadow,border-color] duration-500 ease-spring focus-within:border-border-glow hover:-translate-y-1.5 hover:border-border-glow hover:shadow-lift",
        className,
      )}
    >
      <PostCover
        title={post.title}
        src={post.coverUrl}
        alt={post.coverAlt}
        sizes="(min-width: 1280px) 26rem, (min-width: 768px) 45vw, 92vw"
      />
      <div className="flex flex-1 flex-col gap-3 px-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          {post.publishedAt ? (
            <time dateTime={post.publishedAt}>
              {formatLongDate(post.publishedAt)}
            </time>
          ) : null}
          <span aria-hidden="true">·</span>
          <span>{String(post.readingMinutes)} min read</span>
        </div>
        <Heading className="text-xl leading-snug font-semibold">
          <Link
            href={`/blog/${post.slug}` as Route}
            className="rounded-sm after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {post.title}
          </Link>
        </Heading>
        <p className="text-[0.93rem] leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        {post.categories.length > 0 ? (
          <ul className="mt-auto flex flex-wrap gap-2 pt-1">
            {post.categories.map((category) => (
              <li key={category.id}>
                <Badge variant="outline">{category.name}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
