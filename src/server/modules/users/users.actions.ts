"use server";

import {
  createUserSchema,
  setPasswordSchema,
  setStatusSchema,
  updateUserSchema,
  userIdSchema,
} from "@/lib/schemas/users";
import { adminAction } from "@/server/core/action";
import { userTags } from "./users.constants";
import {
  createUser,
  deleteUser,
  setUserPassword,
  setUserStatus,
  updateUser,
} from "./users.service";

// Thin on purpose: parse (done by adminAction) -> service call. The service
// authorizes again and writes the audit row; userTags says what to expire.

export const createUserAction = adminAction(
  "user.create",
  createUserSchema,
  async (data) => {
    const user = await createUser(data);
    return { id: user.id };
  },
  { tags: userTags.create },
);

export const updateUserAction = adminAction(
  "user.update",
  updateUserSchema,
  async (data) => {
    await updateUser(data);
  },
  { tags: userTags.update },
);

export const setUserStatusAction = adminAction(
  "user.setStatus",
  setStatusSchema,
  async (data) => {
    await setUserStatus(data.id, data.status);
  },
  { tags: userTags.setStatus },
);

export const deleteUserAction = adminAction(
  "user.delete",
  userIdSchema,
  async (data) => {
    await deleteUser(data.id);
  },
  { tags: userTags.remove },
);

export const setUserPasswordAction = adminAction(
  "user.setPassword",
  setPasswordSchema,
  async (data) => {
    await setUserPassword(data.id, data.password);
  },
  { tags: userTags.setPassword },
);
