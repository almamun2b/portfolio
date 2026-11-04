"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { ActionForm } from "@/components/forms/action-form";
import { SelectField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import type { ProjectAdminDTO } from "@/lib/dto";
import {
  createProjectAction,
  updateProjectAction,
} from "@/server/modules/projects/projects.actions";
import { ProjectBasicsFields } from "./project-fields-basics";
import { ProjectStoryFields, type Option } from "./project-fields-story";

/** Create (no `project`) or edit one project. */
export function ProjectForm({
  project,
  categories,
  techOptions,
}: {
  project?: ProjectAdminDTO;
  categories: Option[];
  techOptions: Option[];
}) {
  const router = useRouter();
  return (
    <ActionForm
      action={project ? updateProjectAction : createProjectAction}
      successMessage={project ? "Project saved." : "Project created."}
      onSuccess={(data) => {
        if (project) router.refresh();
        else router.replace(`/admin/projects/${data.id}`);
      }}
      className="flex flex-col gap-6"
      aria-label={project ? "Edit project" : "Add project"}
    >
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Basics</h2>
        <ProjectBasicsFields project={project} />
      </Card>
      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Case study</h2>
        <ProjectStoryFields
          project={project}
          categories={categories}
          techOptions={techOptions}
        />
      </Card>
      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="w-full sm:max-w-56">
          <SelectField
            name="status"
            label="Status"
            hint="Drafts are visible only here."
            defaultValue={project?.status ?? "DRAFT"}
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
            ]}
          />
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <ButtonLink href="/admin/projects" variant="outline">
            Back to projects
          </ButtonLink>
          <SubmitButton pendingLabel="Saving">
            <Save aria-hidden="true" />{" "}
            {project ? "Save project" : "Create project"}
          </SubmitButton>
        </div>
      </Card>
    </ActionForm>
  );
}
