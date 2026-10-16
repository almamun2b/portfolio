import { BlogsResponse, ProjectsResponse } from "@/types";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXTAUTH_URL || "https://portfolio-mamun.vercel.app";

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

  // Fetch dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`);
    const blogData = (await blogRes.json()) as BlogsResponse;
    if (blogData.success && blogData.data.posts) {
      blogRoutes = blogData.data.posts.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  // Fetch dynamic project routes
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projectRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project`);
    const projectData = (await projectRes.json()) as ProjectsResponse;
    if (projectData.success && projectData.data.projects) {
      projectRoutes = projectData.data.projects.map((project) => ({
        url: `${baseUrl}/project/${project.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  return [...routes, ...blogRoutes, ...projectRoutes];
}
