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
