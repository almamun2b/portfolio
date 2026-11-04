import "server-only";
import {
  createUserBodySchema,
  setPasswordBodySchema,
  setStatusBodySchema,
  updateUserBodySchema,
  userIdSchema,
  userListParamsSchema,
} from "@/lib/schemas/users";
import { AppError } from "@/server/core/errors/app-error";
import { apiRoute } from "@/server/core/http/route";
import { userTags } from "./users.constants";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  setUserPassword,
  setUserStatus,
  updateUser,
} from "./users.service";

// HTTP controllers: each one is apiRoute(config, handler), where the handler
// is a one-line call into users.service. The same service and the same
// userTags back the Server Actions in users.actions.ts.

export const listUsersRoute = apiRoute(
  { name: "users.list", auth: "admin", query: userListParamsSchema },
  ({ query }) => listUsers(query),
);

export const createUserRoute = apiRoute(
  {
    name: "users.create",
    auth: "admin",
    body: createUserBodySchema,
    status: 201,
    message: "User created.",
    tags: () => userTags.create(),
  },
  ({ body }) => createUser(body),
);

export const getUserRoute = apiRoute(
  { name: "users.get", auth: "admin", params: userIdSchema },
  async ({ params }) => {
    const user = await getUserById(params.id);
    if (!user) throw AppError.notFound("That user no longer exists.");
    return user;
  },
);

export const updateUserRoute = apiRoute(
  {
    name: "users.update",
    auth: "admin",
    params: userIdSchema,
    body: updateUserBodySchema,
    message: "User updated.",
    tags: ({ params }) => userTags.update(params),
  },
  ({ params, body }) => updateUser({ id: params.id, ...body }),
);

export const setUserStatusRoute = apiRoute(
  {
    name: "users.setStatus",
    auth: "admin",
    params: userIdSchema,
    body: setStatusBodySchema,
    message: "Status updated.",
    tags: ({ params }) => userTags.setStatus(params),
  },
  ({ params, body }) => setUserStatus(params.id, body.status),
);

export const setUserPasswordRoute = apiRoute(
  {
    name: "users.setPassword",
    auth: "admin",
    params: userIdSchema,
    body: setPasswordBodySchema,
    message: "Password updated. The user was signed out everywhere.",
    tags: ({ params }) => userTags.setPassword(params),
  },
  async ({ params, body }) => {
    await setUserPassword(params.id, body.password);
    return null;
  },
);

export const deleteUserRoute = apiRoute(
  {
    name: "users.delete",
    auth: "admin",
    params: userIdSchema,
    message: "User deleted.",
    tags: ({ params }) => userTags.remove(params),
  },
  async ({ params }) => {
    await deleteUser(params.id);
    return null;
  },
);
