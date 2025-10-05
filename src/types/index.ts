export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCK";
export interface User {
  id: number;
  name: string;
  email: string;
  password: string | null;
  role: Role;
  phone: string;
  picture: string | null;
  status: UserStatus;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  posts?: Blog[];
}

export interface Meta {
  total: number;
  page: number;
  limit: number; // pageSize
  totalPages: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string | null;
  type: string;
  projectUrl: string;
  codeUrl: string;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string | null;
  isFeatured: boolean;
  category: string;
  tags: string[];
  views: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}

export interface BlogsResponse {
  blogs: Blog[];
  meta: Meta;
}

export interface ProjectsResponse {
  projects: Project[];
  meta: Meta;
}

export interface SingleProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}
