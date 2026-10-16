import { prisma } from "@/lib/prisma";
import {
  Blog,
  BlogsResponse,
  CategoriesResponse,
  Category,
  Meta,
  ProjectsResponse,
  SingleBlogResponse,
  SingleCategoryResponse,
  SingleProjectResponse,
  User,
} from "@/types";

const AUTHOR_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  picture: true,
  role: true,
  status: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
};

const meta = (total: number, page: number, limit: number): Meta => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 0,
});

const isNumeric = (value: string) => /^\d+$/.test(value);

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const uniqueSlug = (text: string) => `${slugify(text)}-${Date.now()}`;

/* ---------------- Projects ---------------- */

export const getProjects = async ({
  page = 1,
  limit = 6,
}: { page?: number; limit?: number } = {}): Promise<ProjectsResponse> => {
  try {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count(),
    ]);
    return {
      success: true,
      message: "Projects retrieved successfully",
      data: { projects, meta: meta(total, page, limit) },
    };
  } catch (error) {
    console.error("getProjects failed:", error);
    return {
      success: false,
      message: "Failed to retrieve projects",
      data: { projects: [], meta: meta(0, page, limit) },
    };
  }
};

export const getAllProjects = async () => {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("getAllProjects failed:", error);
    return [];
  }
};

export const getProject = async (
  idOrSlug: string | number
): Promise<SingleProjectResponse | null> => {
  try {
    const project = await prisma.project.findFirst({
      where: isNumeric(String(idOrSlug))
        ? { id: Number(idOrSlug) }
        : { slug: String(idOrSlug) },
    });
    if (!project) return null;
    return {
      success: true,
      message: "Project retrieved successfully",
      data: project,
    };
  } catch (error) {
    console.error("getProject failed:", error);
    return null;
  }
};

export const createProjectRecord = async (data: {
  title: string;
  description: string;
  content: string;
  image?: string | null;
  type: "Frontend" | "Backend" | "Fullstack";
  projectUrl?: string | null;
  codeUrl?: string | null;
  technologies: string[];
}) => {
  return prisma.project.create({
    data: {
      ...data,
      projectUrl: data.projectUrl || "",
      slug: uniqueSlug(data.title),
    },
  });
};

export const updateProjectRecord = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    content?: string;
    image?: string | null;
    type?: "Frontend" | "Backend" | "Fullstack";
    projectUrl?: string | null;
    codeUrl?: string | null;
    technologies?: string[];
  }
) => {
  const { projectUrl, ...rest } = data;
  return prisma.project.update({
    where: { id },
    data: {
      ...rest,
      ...(projectUrl !== undefined && { projectUrl: projectUrl || "" }),
    },
  });
};

export const deleteProjectRecord = async (id: number) => {
  return prisma.project.delete({ where: { id } });
};

/* ---------------- Blogs ---------------- */

const blogInclude = {
  category: true,
  author: { select: AUTHOR_SELECT },
};

export const getBlogs = async ({
  page = 1,
  limit = 6,
  category,
  search,
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
} = {}): Promise<BlogsResponse> => {
  try {
    const where = {
      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: blogInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);
    return {
      success: true,
      message: "Blogs retrieved successfully",
      data: { posts: posts as unknown as Blog[], meta: meta(total, page, limit) },
    };
  } catch (error) {
    console.error("getBlogs failed:", error);
    return {
      success: false,
      message: "Failed to retrieve blogs",
      data: { posts: [], meta: meta(0, page, limit) },
    };
  }
};

export const getPopularBlogs = async (limit = 5): Promise<Blog[]> => {
  try {
    const blogs = await prisma.blog.findMany({
      include: blogInclude,
      orderBy: { views: "desc" },
      take: limit,
    });
    return blogs as unknown as Blog[];
  } catch (error) {
    console.error("getPopularBlogs failed:", error);
    return [];
  }
};

export const getBlog = async (
  idOrSlug: string | number
): Promise<SingleBlogResponse | null> => {
  try {
    const blog = await prisma.blog.findFirst({
      where: isNumeric(String(idOrSlug))
        ? { id: Number(idOrSlug) }
        : { slug: String(idOrSlug) },
      include: blogInclude,
    });
    if (!blog) return null;
    return {
      success: true,
      message: "Blog retrieved successfully",
      data: blog as unknown as Blog,
    };
  } catch (error) {
    console.error("getBlog failed:", error);
    return null;
  }
};

export const getRelatedBlogs = async (
  categorySlug: string,
  excludeId: number,
  limit = 3
): Promise<Blog[]> => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { category: { slug: categorySlug }, NOT: { id: excludeId } },
      include: blogInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return blogs as unknown as Blog[];
  } catch (error) {
    console.error("getRelatedBlogs failed:", error);
    return [];
  }
};

export const createBlogRecord = async (data: {
  title: string;
  description: string;
  content: string;
  image?: string | null;
  isFeatured?: boolean;
  categoryId: number;
  tags: string[];
  authorId: number;
}) => {
  return prisma.blog.create({
    data: { ...data, slug: uniqueSlug(data.title) },
    include: blogInclude,
  });
};

export const updateBlogRecord = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    content?: string;
    image?: string | null;
    isFeatured?: boolean;
    categoryId?: number;
    tags?: string[];
  }
) => {
  return prisma.blog.update({ where: { id }, data, include: blogInclude });
};

export const deleteBlogRecord = async (id: number) => {
  return prisma.blog.delete({ where: { id } });
};

export const incrementBlogViews = async (id: number) => {
  try {
    await prisma.blog.update({ where: { id }, data: { views: { increment: 1 } } });
  } catch (error) {
    console.error("incrementBlogViews failed:", error);
  }
};

/* ---------------- Categories ---------------- */

export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    const data = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      message: "Categories retrieved successfully",
      data: data as Category[],
    };
  } catch (error) {
    console.error("getCategories failed:", error);
    return {
      success: false,
      message: "Failed to retrieve categories",
      data: [],
    };
  }
};

export const getCategory = async (
  idOrSlug: string | number
): Promise<SingleCategoryResponse | null> => {
  try {
    const category = await prisma.category.findFirst({
      where: isNumeric(String(idOrSlug))
        ? { id: Number(idOrSlug) }
        : { slug: String(idOrSlug) },
    });
    if (!category) return null;
    return {
      success: true,
      message: "Category retrieved successfully",
      data: category,
    };
  } catch (error) {
    console.error("getCategory failed:", error);
    return null;
  }
};

export const createCategoryRecord = async (data: { name: string }) => {
  return prisma.category.create({
    data: { name: data.name, slug: uniqueSlug(data.name) },
  });
};

export const updateCategoryRecord = async (
  id: number,
  data: { name: string }
) => {
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategoryRecord = async (id: number) => {
  return prisma.category.delete({ where: { id } });
};

/* ---------------- Users ---------------- */

export const getUserRecordById = async (id: number): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: AUTHOR_SELECT,
    });
    return (user as unknown as User) ?? null;
  } catch (error) {
    console.error("getUserRecordById failed:", error);
    return null;
  }
};

export { slugify, uniqueSlug };
