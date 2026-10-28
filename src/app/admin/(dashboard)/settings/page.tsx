import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";
import { requireAdmin } from "@/server/modules/auth/auth.guard";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  return (
    <ComingSoon
      href="/admin/settings"
      planned={[
        "Site title and social links",
        "Contact details",
        "Feature switches",
        "Admin preferences",
      ]}
    />
  );
}
