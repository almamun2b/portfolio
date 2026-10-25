import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";
import { requireAdmin } from "@/server/dal/auth";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  await requireAdmin();
  return (
    <ComingSoon
      href="/admin/projects"
      planned={[
        "Case studies with screenshots",
        "Draft and publish states",
        "Tech stack tags",
        "Featured ordering",
      ]}
    />
  );
}
