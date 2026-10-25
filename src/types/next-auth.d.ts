import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    /** DB id of the Session row (not secret): "current device" in the UI. */
    sessionId: string;
    user: { id: string; role: "ADMIN" } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN";
  }
}
