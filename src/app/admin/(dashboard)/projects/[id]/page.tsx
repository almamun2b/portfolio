import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { projectHref } from "@/lib/site";
import { TECH_IDS } from "@/lib/tech-ids";
import { getTech } from "@/lib/tech";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listAllCategories } from "@/server/modules/categories/categories.service";
import { getProjectById } from "@/server/modules/projects/projects.service";
import { ExternalLink } from "lucide-react";
import { ProjectForm } from "../_components/project-form";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [project, categories] = await Promise.all([
    getProjectById(id),
    listAllCategories(),
  ]);
  if (!project) notFound();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={project.title}
        description={`/projects/${project.slug}`}
        actions={
          project.status === "PUBLISHED" ? (
            <ButtonLink href={projectHref(project.slug)} variant="outline">
              <ExternalLink aria-hidden="true" /> View on site
            </ButtonLink>
          ) : undefined
        }
      />
      <ProjectForm
        project={project}
        categories={categories.map((c) => ({ value: c.id, label: c.name }))}
        techOptions={TECH_IDS.map((tid) => ({
          value: tid,
          label: getTech(tid).label,
        }))}
      />
    </div>
  );
}
