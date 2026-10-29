import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";
import { requireAdmin } from "@/server/modules/auth/auth.guard";

export const metadata: Metadata = { title: "Professions" };

export default async function ProfessionsPage() {
  await requireAdmin();
  return (
    <ComingSoon
      href="/admin/professions"
      planned={[
        "Roles and employers",
        "Date ranges and highlights",
        "Skills per role",
        "Drag to reorder",
      ]}
    />
  );
}
