import "server-only";
import { connection } from "next/server";
import { apiRoute } from "@/server/core/http/route";
import { checkDatabase } from "./health.service";

/** Liveness plus a database round trip, for uptime checks. Never cached. */
export const healthRoute = apiRoute(
  { name: "health", auth: "public" },
  async () => {
    await connection();
    await checkDatabase();
    return { status: "ok" as const };
  },
);
