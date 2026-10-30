"use server";

import { changePasswordSchema } from "@/lib/schemas/auth";
import { adminAction } from "@/server/core/action";
import { getSession } from "@/server/modules/auth/auth.guard";
import { accountTags } from "./account.constants";
import { changeOwnPassword } from "./account.service";

export const changePasswordAction = adminAction(
  "account.changePassword",
  changePasswordSchema,
  async (data) => {
    const session = await getSession();
    return changeOwnPassword(
      data.currentPassword,
      data.newPassword,
      session?.sessionId ?? "",
    );
  },
  { tags: accountTags.changePassword },
);
