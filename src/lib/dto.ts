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

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  perPage: number,
): Paginated<T> {
  return {
    items,
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}
