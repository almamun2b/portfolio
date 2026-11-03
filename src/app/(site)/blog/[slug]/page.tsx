import { slugParams } from "@/lib/static-params";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostCover } from "@/components/blog/post-cover";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { formatLongDate } from "@/lib/format";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { serializeJsonLd } from "@/lib/jsonld";
import {
  getPostBySlug,
  getPostSlugs,
} from "@/server/modules/content/posts.service";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugParams(slugs);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  // A real 404 status for unknown or unpublished slugs, decided before the
  // page body streams.
  if (!post) notFound();
  return pageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

// See projects/[slug]/page.tsx: the param-dependent body streams behind
// <Suspense> for slugs unknown at build time; known slugs are static HTML.
export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={null}>
      <PostArticle params={params} />
    </Suspense>
  );
}

async function PostArticle({
  params,
}: {
  params: PageProps<"/blog/[slug]">["params"];
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article aria-labelledby="page-title" className="pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            blogPostingJsonLd(post),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]),
        }}
      />
      <Container className="flex max-w-3xl flex-col gap-6 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb">
          <Link
            href="/blog"
            className="inline-flex min-h-6 items-center rounded-sm font-mono text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            ← blog
          </Link>
        </nav>
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {formatLongDate(post.publishedAt)}
              </time>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>{String(post.readingMinutes)} min read</span>
          </div>
          <h1
            id="page-title"
            className="text-4xl font-bold tracking-tight text-balance"
          >
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          {post.categories.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <li key={category.id}>
                  <Badge variant="outline" size="md">
                    {category.name}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </header>
        <PostCover
          title={post.title}
          src={post.coverUrl}
          alt={post.coverAlt}
          sizes="(min-width: 768px) 48rem, 92vw"
          priority
        />
        {/* Sanitized on every write (core/rich-text.ts), never raw editor output. */}
        <div
          className="rich-text"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </Container>
    </article>
  );
}
