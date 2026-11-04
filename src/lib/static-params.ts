// With Cache Components, `generateStaticParams` must return at least one
// entry (Next validates the route at build time). Content now comes from the
// database, so a route can legitimately have none yet (no published post) or
// again (every project unpublished). The sentinel is a slug the admin can't
// create (slugs allow only a-z, 0-9 and dashes), so it renders the route's
// own notFound() and never collides with real content.
export const NO_CONTENT_SLUG = "__none__";

export function slugParams(slugs: string[]): { slug: string }[] {
  return (slugs.length > 0 ? slugs : [NO_CONTENT_SLUG]).map((slug) => ({
    slug,
  }));
}
