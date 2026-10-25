"use server";

import {
  createUserSchema,
  revokeSessionSchema,
  setPasswordSchema,
  setStatusSchema,
  updateUserSchema,
  userIdSchema,
} from "@/lib/schemas/users";
import {
  createUser,
  deleteUser,
  setUserStatus,
  updateUser,
} from "@/server/dal/users";
import { setUserPassword } from "@/server/dal/passwords";
import { revokeAllSessions, revokeSession } from "@/server/dal/sessions";
import { adminAction } from "./action";

// Thin on purpose: parse (done by adminAction) -> DAL call. The DAL
// authorizes again, writes the audit row, and expires the cache tags.

export const createUserAction = adminAction(
  "user.create",
  createUserSchema,
  async (data) => {
    const user = await createUser(data);
    return { id: user.id };
  },
);

export const updateUserAction = adminAction(
  "user.update",
  updateUserSchema,
  async (data) => {
    await updateUser(data);
  },
);

export const setUserStatusAction = adminAction(
  "user.setStatus",
  setStatusSchema,
  async (data) => {
    await setUserStatus(data.id, data.status);
  },
);

export const deleteUserAction = adminAction(
  "user.delete",
  userIdSchema,
  async (data) => {
    await deleteUser(data.id);
  },
);

export const setUserPasswordAction = adminAction(
  "user.setPassword",
  setPasswordSchema,
  async (data) => {
    await setUserPassword(data.id, data.password);
  },
);

export const revokeSessionAction = adminAction(
  "session.revoke",
  revokeSessionSchema,
  async (data) => {
    await revokeSession(data.sessionId);
  },
);

export const revokeAllSessionsAction = adminAction(
  "session.revokeAll",
  userIdSchema,
  async (data) => ({ count: await revokeAllSessions(data.id) }),
);
