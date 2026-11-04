import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TECH_IDS } from "@/lib/tech-ids";
import { getTech } from "@/lib/tech";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listAllCategories } from "@/server/modules/categories/categories.service";
import { ProjectForm } from "../_components/project-form";

export const metadata: Metadata = { title: "Add project" };

export default async function NewProjectPage() {
  await requireAdmin();
  const categories = await listAllCategories();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add project"
        description="Save it as a draft first, then publish when the case study reads well."
      />
      <ProjectForm
        categories={categories.map((c) => ({ value: c.id, label: c.name }))}
        techOptions={TECH_IDS.map((id) => ({
          value: id,
          label: getTech(id).label,
        }))}
      />
    </div>
  );
}
