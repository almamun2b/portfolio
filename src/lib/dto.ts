// Plain, serializable shapes the DAL returns. Dates are ISO strings so they
// survive unstable_cache (JSON) and the Server -> Client Component boundary.
// Never add passwordHash, token hashes, or other secrets here.

export interface UserDTO {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN";
  status: "ACTIVE" | "DISABLED";
  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDTO {
  id: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  current: boolean;
}

export interface AuditLogDTO {
  id: string;
  action: string;
  actor: { id: string; name: string | null; email: string } | null;
  targetType: string | null;
  targetId: string | null;
  ip: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface DashboardStatsDTO {
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
  activeSessions: number;
  projects: number;
  publishedProjects: number;
  posts: number;
  publishedPosts: number;
  newMessages: number;
}

export type PublishStatusDTO = "DRAFT" | "PUBLISHED";

export interface CategoryRefDTO {
  id: string;
  slug: string;
  name: string;
}

export interface CategoryDTO extends CategoryRefDTO {
  description: string | null;
  sortOrder: number;
  projectCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectShotDTO {
  src: string;
  width: number;
  height: number;
  alt: string;
  device: "desktop" | "mobile" | "detail";
}

/** A project as the admin sees it (drafts included, ids, timestamps). */
export interface ProjectAdminDTO {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  context: string;
  contribution: string;
  role: string;
  year: string;
  featured: boolean;
  status: PublishStatusDTO;
  sortOrder: number;
  stack: string[];
  problem: string;
  approach: string[];
  outcomes: string[];
  myPart: string[];
  links: { live?: string; source?: string; api?: string; apiSource?: string };
  coverArt: string;
  media: ProjectShotDTO[];
  categories: CategoryRefDTO[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  readingMinutes: number;
  coverUrl: string | null;
  coverAlt: string | null;
  status: PublishStatusDTO;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  categories: CategoryRefDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageDTO {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  status: "NEW" | "READ" | "ARCHIVED";
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
