import { z } from "zod";
import { listBase, sortDir } from "./common";

export const auditListParamsSchema = z.object({
  ...listBase,
  dir: sortDir,
  // "auth", "user" ... the prefix before the first dot of `action`.
  area: z.enum(["auth", "user", "session"]).optional().catch(undefined),
});
export type AuditListParams = z.output<typeof auditListParamsSchema>;
