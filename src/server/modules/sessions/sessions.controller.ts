import "server-only";
import { userIdSchema } from "@/lib/schemas/users";
import { apiRoute } from "@/server/core/http/route";
import { sessionTags } from "./sessions.constants";
import {
  listUserSessions,
  revokeAllSessions,
  revokeSession,
} from "./sessions.service";

export const listUserSessionsRoute = apiRoute(
  { name: "sessions.list", auth: "admin", params: userIdSchema },
  ({ params }) => listUserSessions(params.id),
);

export const revokeAllSessionsRoute = apiRoute(
  {
    name: "sessions.revokeAll",
    auth: "admin",
    params: userIdSchema,
    message: "Signed out everywhere.",
    tags: ({ params }) => sessionTags.revokeAll(params),
  },
  ({ params }) => revokeAllSessions(params.id),
);

/** `DELETE /api/sessions/[id]`: the `id` here is a session id, not a user id. */
export const revokeSessionRoute = apiRoute(
  {
    name: "sessions.revoke",
    auth: "admin",
    params: userIdSchema,
    message: "Session revoked.",
    tags: ({ params }, result: { userId: string }) =>
      sessionTags.revoke({ sessionId: params.id }, result),
  },
  ({ params }) => revokeSession(params.id),
);
