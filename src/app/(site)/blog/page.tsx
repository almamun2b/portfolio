import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { pageMetadata } from "@/lib/metadata";
import { getPosts } from "@/server/modules/content/posts.service";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Notes on full-stack engineering, Next.js, PostgreSQL, and Shopify apps by Md Abdul Mamun.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        path="blog"
        title="Notes from"
        highlight="the build"
        description="What I learn shipping production web apps: the decisions, the trade-offs, and the bugs."
      />
      <Container className="pb-12">
        {posts.length === 0 ? (
          <p className="rounded-3xl border border-border glass p-8 text-muted-foreground">
            No posts yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} className="h-full" />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
