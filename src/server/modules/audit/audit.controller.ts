import "server-only";
import { auditListParamsSchema } from "@/lib/schemas/audit";
import { apiRoute } from "@/server/core/http/route";
import { listAuditLogs } from "./audit.service";

export const listAuditLogsRoute = apiRoute(
  { name: "audit.list", auth: "admin", query: auditListParamsSchema },
  ({ query }) => listAuditLogs(query),
);
