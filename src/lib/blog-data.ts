// Mock blog data for demonstration
export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  publisher: string;
  publisherAvatar: string;
  createdAt: string;
  views: number;
  featured?: boolean;
}

export const mockBlogs: Blog[] = [
  {
    id: "1",
    slug: "getting-started-nextjs",
    title: "Getting Started with Next.js 15",
    description:
      "Learn how to build modern web applications with Next.js 15 and its powerful features including App Router and Server Components.",
    image: "/blog/nextjs-development.png",
    category: "Development",
    tags: ["Next.js", "React", "Web Development"],
    publisher: "John Doe",
    publisherAvatar: "/developer-avatar.png",
    createdAt: "2024-03-15",
    views: 1250,
    featured: true,
  },
  {
    id: "2",
    slug: "tailwind-css-tips",
    title: "10 Tailwind CSS Tips for Better UI",
    description:
      "Discover essential Tailwind CSS techniques to create beautiful and responsive user interfaces efficiently.",
    image: "/blog/tailwind-css-design.png",
    category: "Design",
    tags: ["Tailwind", "CSS", "UI/UX"],
    publisher: "Jane Smith",
    publisherAvatar: "/diverse-designer-avatars.png",
    createdAt: "2024-03-14",
    views: 980,
    featured: true,
  },
  {
    id: "3",
    slug: "typescript-best-practices",
    title: "TypeScript Best Practices in 2024",
    description:
      "Master TypeScript with these proven best practices and patterns for building type-safe applications.",
    image: "/blog/typescript-code.png",
    category: "Development",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    publisher: "Mike Johnson",
    publisherAvatar: "/programmer-avatar.png",
    createdAt: "2024-03-13",
    views: 1450,
  },
  {
    id: "4",
    slug: "react-server-components",
    title: "Understanding React Server Components",
    description:
      "A deep dive into React Server Components and how they revolutionize data fetching in modern React applications.",
    image: "/blog/react-components.png",
    category: "Development",
    tags: ["React", "Server Components", "Performance"],
    publisher: "Sarah Williams",
    publisherAvatar: "/female-developer.png",
    createdAt: "2024-03-12",
    views: 2100,
  },
  {
    id: "5",
    slug: "ui-design-principles",
    title: "Essential UI Design Principles",
    description:
      "Learn the fundamental principles of user interface design that every designer should know.",
    image: "/blog/ui-design-principles.jpg",
    category: "Design",
    tags: ["UI/UX", "Design", "Principles"],
    publisher: "Emily Brown",
    publisherAvatar: "/stylish-woman.png",
    createdAt: "2024-03-11",
    views: 875,
  },
  {
    id: "6",
    slug: "api-design-patterns",
    title: "Modern API Design Patterns",
    description:
      "Explore modern API design patterns and best practices for building scalable backend services.",
    image: "/blog/api-architecture.png",
    category: "Backend",
    tags: ["API", "Backend", "Architecture"],
    publisher: "David Lee",
    publisherAvatar: "/backend-developer.png",
    createdAt: "2024-03-10",
    views: 1320,
  },
  {
    id: "7",
    slug: "responsive-design-guide",
    title: "Complete Guide to Responsive Design",
    description:
      "Master responsive web design with this comprehensive guide covering all essential techniques and tools.",
    image: "/blog/responsive-web-design.png",
    category: "Design",
    tags: ["Responsive", "CSS", "Mobile"],
    publisher: "Lisa Anderson",
    publisherAvatar: "/web-designer.png",
    createdAt: "2024-03-09",
    views: 1680,
  },
  {
    id: "8",
    slug: "database-optimization",
    title: "Database Optimization Techniques",
    description:
      "Learn advanced database optimization techniques to improve query performance and scalability.",
    image: "/blog/database-optimization.png",
    category: "Backend",
    tags: ["Database", "Performance", "SQL"],
    publisher: "Robert Chen",
    publisherAvatar: "/database-engineer.jpg",
    createdAt: "2024-03-08",
    views: 945,
  },
  {
    id: "9",
    slug: "web-accessibility",
    title: "Web Accessibility: A Complete Guide",
    description:
      "Make your websites accessible to everyone with this comprehensive guide to web accessibility standards.",
    image: "/blog/web-accessibility-concept.png",
    category: "Development",
    tags: ["Accessibility", "A11y", "Web Standards"],
    publisher: "Maria Garcia",
    publisherAvatar: "/accessibility-expert.jpg",
    createdAt: "2024-03-07",
    views: 1150,
  },
  {
    id: "10",
    slug: "state-management-react",
    title: "State Management in React Applications",
    description:
      "Compare different state management solutions for React and learn when to use each approach.",
    image: "/blog/react-state-management.png",
    category: "Development",
    tags: ["React", "State Management", "Redux"],
    publisher: "Tom Wilson",
    publisherAvatar: "/react-developer.png",
    createdAt: "2024-03-06",
    views: 1890,
  },
];

export const categories = [
  { name: "All", count: mockBlogs.length },
  {
    name: "Development",
    count: mockBlogs.filter((b) => b.category === "Development").length,
  },
  {
    name: "Design",
    count: mockBlogs.filter((b) => b.category === "Design").length,
  },
  {
    name: "Backend",
    count: mockBlogs.filter((b) => b.category === "Backend").length,
  },
];

export const allTags = Array.from(
  new Set(mockBlogs.flatMap((blog) => blog.tags))
).map((tag) => ({
  name: tag,
  count: mockBlogs.filter((blog) => blog.tags.includes(tag)).length,
}));

export function getFeaturedBlogs() {
  return mockBlogs.filter((blog) => blog.featured);
}

export function getPopularBlogs(limit = 5) {
  return [...mockBlogs].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getRecentBlogs(limit = 3) {
  return [...mockBlogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export function getBlogsByCategory(category: string) {
  if (category === "All") return mockBlogs;
  return mockBlogs.filter((blog) => blog.category === category);
}

export function searchBlogs(query: string) {
  const lowerQuery = query.toLowerCase();
  return mockBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.description.toLowerCase().includes(lowerQuery) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getBlogBySlug(slug: string) {
  return mockBlogs.find((blog) => blog.slug === slug);
}

export function getRelatedBlogs(
  currentBlogId: string,
  category: string,
  limit = 3
) {
  return mockBlogs
    .filter((blog) => blog.id !== currentBlogId && blog.category === category)
    .slice(0, limit);
}
