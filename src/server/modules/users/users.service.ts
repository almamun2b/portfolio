import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Paginated, UserDTO } from "@/lib/dto";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListParams,
} from "@/lib/schemas/users";
import { writeAudit } from "@/server/core/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import { hashPassword } from "@/server/core/password";
import { QueryBuilder } from "@/server/core/query-builder";
import { assertAdmin, requireAdmin } from "@/server/modules/auth/auth.guard";
import { USER_SEARCHABLE_FIELDS } from "./users.constants";
import { isUniqueViolation, toUserDTO, userSelect } from "./users.model";

const emailTaken = () =>
  AppError.conflict("That email is already in use.", {
    email: ["That email is already in use."],
  });

const gone = () => AppError.notFound("That user no longer exists.");

// ---- reads (authorize first, then cached + tagged) -------------------------
// Authorization reads cookies, so it stays outside the cached functions; the
// cache key is the plain params object. Every caller (page, action, API)
// shares one entry until a mutation expires the `users` tag.

export async function listUsers(
  params: UserListParams,
): Promise<Paginated<UserDTO>> {
  await requireAdmin();
  return listUsersCached(params);
}

async function listUsersCached(
  params: UserListParams,
): Promise<Paginated<UserDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.USERS);
  cacheLife("admin");
  const { data, meta } = await new QueryBuilder(db.user)
    .search({
      searchText: params.searchTerm,
      fields: [...USER_SEARCHABLE_FIELDS],
    })
    .filter({ status: params.status })
    .custom({
      orderBy: [{ [params.sortBy]: params.sortOrder }, { id: "asc" }],
    })
    .paginate({ page: params.page, limit: params.limit })
    .select(userSelect)
    .executeWithMeta();
  return { data: data.map(toUserDTO), meta };
}

/** Null when the id doesn't exist (the page responds with notFound()). */
export async function getUserById(id: string): Promise<UserDTO | null> {
  await requireAdmin();
  return getUserByIdCached(id);
}

async function getUserByIdCached(id: string): Promise<UserDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.USERS, CACHE_TAGS.user(id));
  cacheLife("admin");
  const row = await db.user.findUnique({ where: { id }, select: userSelect });
  return row ? toUserDTO(row) : null;
}

// ---- writes (authorize, validate invariants, change + audit) ---------------
// Cache invalidation is declared in users.constants.ts (userTags) and applied
// by the action/route wrapper, so a service stays pure business logic.

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
  if (!before) throw gone();
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
    throw AppError.conflict("At least one active admin must remain.");
  }
}

export async function setUserStatus(
  id: string,
  status: "ACTIVE" | "DISABLED",
): Promise<UserDTO> {
  const actor = await assertAdmin();
  if (id === actor.id && status === "DISABLED") {
    throw AppError.conflict("You can't disable your own account.");
  }
  const target = await db.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if (!target) throw gone();
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
  return toUserDTO(row);
}

export async function deleteUser(id: string): Promise<void> {
  const actor = await assertAdmin();
  if (id === actor.id) {
    throw AppError.conflict("You can't delete your own account.");
  }
  const target = await db.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if (!target) throw gone();
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
}

/** An admin sets another user's password; that user is signed out everywhere. */
export async function setUserPassword(
  id: string,
  password: string,
): Promise<void> {
  const actor = await assertAdmin();
  if (id === actor.id) {
    throw AppError.conflict("Change your own password from your account page.");
  }
  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!target) throw gone();
  const passwordHash = await hashPassword(password);
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data: { passwordHash, passwordChangedAt: new Date() },
    });
    await tx.session.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await writeAudit(
      {
        actorId: actor.id,
        action: "user.password.reset",
        targetType: "user",
        targetId: id,
        metadata: { email: target.email },
      },
      tx,
    );
  });
}
