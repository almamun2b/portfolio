import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export const getUserSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
