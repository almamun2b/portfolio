import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { Paginated, UserDTO } from "@/lib/dto";
import { paginated } from "@/lib/dto";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListParams,
} from "@/lib/schemas/users";
import { writeAudit } from "@/server/audit";
import { cached, expireNow, tags } from "@/server/cache";
import { assertAdmin, requireAdmin } from "@/server/dal/auth";
import { db } from "@/server/db";
import { DomainError } from "@/server/errors";
import { hashPassword } from "@/server/password";

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  lastLoginAt: true,
  passwordChangedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type UserRow = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export function toUserDTO(row: UserRow): UserDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    passwordChangedAt: row.passwordChangedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

const emailTaken = () =>
  new DomainError("CONFLICT", "That email is already in use.", {
    email: ["That email is already in use."],
  });

// ---- reads (authorized, then cached + tagged) -----------------------------

export async function listUsers(
  params: UserListParams,
): Promise<Paginated<UserDTO>> {
  await requireAdmin();
  return cached(
    ["users", "list", JSON.stringify(params)],
    { tags: [tags.users] },
    async () => {
      const where: Prisma.UserWhereInput = {
        ...(params.status ? { status: params.status } : {}),
        ...(params.q
          ? {
              OR: [
                { name: { contains: params.q, mode: "insensitive" } },
                { email: { contains: params.q, mode: "insensitive" } },
              ],
            }
          : {}),
      };
      const [rows, total] = await Promise.all([
        db.user.findMany({
          where,
          select: userSelect,
          orderBy: [{ [params.sort]: params.dir }, { id: "asc" }],
          skip: (params.page - 1) * params.perPage,
          take: params.perPage,
        }),
        db.user.count({ where }),
      ]);
      return paginated(rows.map(toUserDTO), total, params.page, params.perPage);
    },
  );
}

/** Null when the id doesn't exist (the page responds with notFound()). */
export async function getUserById(id: string): Promise<UserDTO | null> {
  await requireAdmin();
  return cached(
    ["users", "byId", id],
    { tags: [tags.users, tags.user(id)] },
    async () => {
      const row = await db.user.findUnique({
        where: { id },
        select: userSelect,
      });
      return row ? toUserDTO(row) : null;
    },
  );
}

// ---- writes (authorize, validate invariants, change + audit, expire) ------

export async function createUser(input: CreateUserInput): Promise<UserDTO> {
  const actor = await assertAdmin();
  const email = input.email.trim().toLowerCase();
  if (await db.user.findUnique({ where: { email }, select: { id: true } })) {
    throw emailTaken();
  }
  const passwordHash = await hashPassword(input.password);
  try {
    const row = await db.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: input.name.trim(),
          email,
          passwordHash,
          passwordChangedAt: new Date(),
        },
        select: userSelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "user.create",
          targetType: "user",
          targetId: created.id,
          metadata: { email },
        },
        tx,
      );
      return created;
    });
    expireNow(tags.users, tags.dashboard, tags.audit);
    return toUserDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw emailTaken();
    throw error;
  }
}

export async function updateUser(input: UpdateUserInput): Promise<UserDTO> {
  const actor = await assertAdmin();
  const before = await db.user.findUnique({
    where: { id: input.id },
    select: userSelect,
  });
  if (!before)
    throw new DomainError("NOT_FOUND", "That user no longer exists.");
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  try {
    const row = await db.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: input.id },
        data: { name, email },
        select: userSelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "user.update",
          targetType: "user",
          targetId: input.id,
          metadata: {
            from: { name: before.name, email: before.email },
            to: { name, email },
          },
        },
        tx,
      );
      return updated;
    });
    expireNow(tags.users, tags.user(input.id), tags.audit);
    return toUserDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw emailTaken();
    throw error;
  }
}

/** Refuses to leave the system without an active admin. */
async function assertAnotherActiveAdmin(excludeId: string): Promise<void> {
  const others = await db.user.count({
    where: { id: { not: excludeId }, status: "ACTIVE", role: "ADMIN" },
  });
  if (others === 0) {
    throw new DomainError("CONFLICT", "At least one active admin must remain.");
  }
}

export async function setUserStatus(
  id: string,
  status: "ACTIVE" | "DISABLED",
): Promise<UserDTO> {
  const actor = await assertAdmin();
  if (id === actor.id && status === "DISABLED") {
    throw new DomainError("CONFLICT", "You can't disable your own account.");
  }
  const target = await db.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if (!target)
    throw new DomainError("NOT_FOUND", "That user no longer exists.");
  if (target.status === status) return toUserDTO(target);
  if (status === "DISABLED") await assertAnotherActiveAdmin(id);

  const row = await db.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id },
      data: { status },
      select: userSelect,
    });
    if (status === "DISABLED") {
      // Sign them out everywhere, now.
      await tx.session.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    await writeAudit(
      {
        actorId: actor.id,
        action: status === "DISABLED" ? "user.disable" : "user.enable",
        targetType: "user",
        targetId: id,
        metadata: { email: target.email },
      },
      tx,
    );
    return updated;
  });
  expireNow(
    tags.users,
    tags.user(id),
    tags.sessions(id),
    tags.dashboard,
    tags.audit,
  );
  return toUserDTO(row);
}

export async function deleteUser(id: string): Promise<void> {
  const actor = await assertAdmin();
  if (id === actor.id)
    throw new DomainError("CONFLICT", "You can't delete your own account.");
  const target = await db.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if (!target)
    throw new DomainError("NOT_FOUND", "That user no longer exists.");
  if (target.status === "ACTIVE") await assertAnotherActiveAdmin(id);

  await db.$transaction(async (tx) => {
    await writeAudit(
      {
        actorId: actor.id,
        action: "user.delete",
        targetType: "user",
        targetId: id,
        metadata: { email: target.email, name: target.name },
      },
      tx,
    );
    await tx.user.delete({ where: { id } }); // sessions cascade
  });
  expireNow(
    tags.users,
    tags.user(id),
    tags.sessions(id),
    tags.dashboard,
    tags.audit,
  );
}
