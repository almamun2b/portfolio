import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { UserMenu } from "./user-menu";

/**
 * The one dynamic part of the admin frame: the signed-in user. It reads the
 * session, so the layout renders it behind a <Suspense> with UserMenuSkeleton
 * and the rest of the frame stays in the prerendered shell.
 */
export async function UserMenuSlot() {
  const admin = await requireAdmin();
  return <UserMenu user={{ name: admin.name, email: admin.email }} />;
}
