import "server-only";
import { changePasswordSchema } from "@/lib/schemas/auth";
import { apiRoute } from "@/server/core/http/route";
import { getSession } from "@/server/modules/auth/auth.guard";
import { accountTags } from "./account.constants";
import { changeOwnPassword } from "./account.service";

export const changePasswordRoute = apiRoute(
  {
    name: "account.changePassword",
    auth: "admin",
    body: changePasswordSchema,
    message: "Password changed. Other devices were signed out.",
    tags: accountTags.changePassword,
  },
  async ({ body }) => {
    const session = await getSession();
    return changeOwnPassword(
      body.currentPassword,
      body.newPassword,
      session?.sessionId ?? "",
    );
  },
);
