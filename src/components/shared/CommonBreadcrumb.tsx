"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

const CommonBreadcrumb = () => {
  const pathname = usePathname();

  // Function to generate breadcrumb segments from pathname
  const generateBreadcrumbs = (path: string): BreadcrumbSegment[] => {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];

    // Always start with Home for dashboard routes
    if (path.startsWith("/dashboard") || segments.length > 0) {
      breadcrumbs.push({
        label: "Home",
        href: "/",
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Get human-readable label for the segment
      const label = getSegmentLabel(segment);

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: isLast,
      });
    });

    return breadcrumbs;
  };

  // Function to convert path segments to human-readable labels
  const getSegmentLabel = (segment: string): string => {
    // Handle special cases and route mappings
    const labelMappings: Record<string, string> = {
      dashboard: "Dashboard",
      projects: "Projects",
      blogs: "Blogs",
      "blog-category": "Blog Categories",
      create: "Create",
      edit: "Edit",
    };

    // Check if it's a mapped segment
    if (labelMappings[segment]) {
      return labelMappings[segment];
    }

    // Handle dynamic segments (like IDs or slugs)
    if (segment.match(/^[a-f0-9-]{36}$/) || segment.match(/^\d+$/)) {
      // If it looks like a UUID or ID, try to get a more meaningful label
      return "Details";
    }

    // Convert kebab-case or snake_case to Title Case
    return segment
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbs = generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on home page
  if (pathname === "/" || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            <BreadcrumbItem>
              {breadcrumb.isCurrentPage ? (
                <BreadcrumbPage className="flex items-center gap-1">
                  {breadcrumb.label === "Home" && <Home className="h-4 w-4" />}
                  {breadcrumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={breadcrumb.href}
                    className="flex items-center gap-1"
                  >
                    {breadcrumb.label === "Home" && (
                      <Home className="h-4 w-4" />
                    )}
                    {breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CommonBreadcrumb;
