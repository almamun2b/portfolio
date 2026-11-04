"use server";

import { revokeSessionSchema, userIdSchema } from "@/lib/schemas/users";
import { adminAction } from "@/server/core/action";
import { sessionTags } from "./sessions.constants";
import { revokeAllSessions, revokeSession } from "./sessions.service";

export const revokeSessionAction = adminAction(
  "session.revoke",
  revokeSessionSchema,
  (data) => revokeSession(data.sessionId),
  { tags: sessionTags.revoke },
);

export const revokeAllSessionsAction = adminAction(
  "session.revokeAll",
  userIdSchema,
  (data) => revokeAllSessions(data.id),
  { tags: sessionTags.revokeAll },
);
