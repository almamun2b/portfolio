import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";
import { requireAdmin } from "@/server/modules/auth/auth.guard";

export const metadata: Metadata = { title: "Professions" };

// Blocking on purpose: a click keeps the current page until this one is
// ready (see AGENTS.md › Navigation), so there is no skeleton to validate.
export const instant = false;

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
