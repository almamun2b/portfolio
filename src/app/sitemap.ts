import { getAllProjects, getBlogs } from "@/lib/queries";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXTAUTH_URL || "https://portfolio-mamun.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    "",
    "/about-me",
    "/blog",
    "/project",
    "/contact-me",
    "/privacy-policy",
    "/terms-conditions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogsData = await getBlogs({ limit: 100, page: 1 });
    if (blogsData.success && blogsData.data.posts) {
      blogRoutes = blogsData.data.posts.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  // Dynamic project routes
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getAllProjects();
    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/project/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  return [...routes, ...blogRoutes, ...projectRoutes];
}
