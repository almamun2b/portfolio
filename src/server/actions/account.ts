"use server";

import { changePasswordSchema } from "@/lib/schemas/auth";
import { getSession } from "@/server/dal/auth";
import { changeOwnPassword } from "@/server/dal/passwords";
import { adminAction } from "./action";

export const changePasswordAction = adminAction(
  "account.changePassword",
  changePasswordSchema,
  async (data) => {
    const session = await getSession();
    await changeOwnPassword(
      data.currentPassword,
      data.newPassword,
      session?.sessionId ?? "",
    );
  },
);
