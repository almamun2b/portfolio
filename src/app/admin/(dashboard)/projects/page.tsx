import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { FilterSelect } from "@/components/ui/filter-select";
import { ListBody, ListRegion } from "@/components/ui/list-region";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { ButtonLink } from "@/components/ui/button-link";
import { projectListParamsSchema } from "@/lib/schemas/projects";
import { first, firstOf, withParams } from "@/lib/url-state";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listProjects } from "@/server/modules/projects/projects.service";
import { Plus } from "lucide-react";
import { ProjectsTable } from "./_components/projects-table";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/admin/projects">) {
  await requireAdmin();
  const query = await searchParams;
  const params = projectListParamsSchema.parse(
    firstOf(query, [
      "page",
      "limit",
      "searchTerm",
      "status",
      "sortBy",
      "sortOrder",
    ]),
  );
  const data = await listProjects(params);
  if (data.meta.total > 0 && params.page > data.meta.totalPage) {
    redirect(
      withParams("/admin/projects", query, {
        page: data.meta.totalPage,
      }) as Route,
    );
  }

  return (
    <ListRegion>
      <PageHeader
        title="Projects"
        description="Case studies shown on the landing page and /projects. Drafts stay private until you publish them."
        actions={
          <ButtonLink href="/admin/projects/new">
            <Plus aria-hidden="true" /> Add project
          </ButtonLink>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          action="/admin/projects"
          label="Search projects"
          placeholder="Search by title or summary"
          defaultValue={params.searchTerm}
          preserve={{
            status: params.status,
            sortBy: first(query.sortBy),
            sortOrder: first(query.sortOrder),
            limit: first(query.limit),
          }}
        />
        <FilterSelect
          param="status"
          label="Filter by status"
          value={params.status}
          allLabel="All statuses"
          options={[
            { value: "PUBLISHED", label: "Published" },
            { value: "DRAFT", label: "Draft" },
          ]}
        />
      </div>
      <ListBody>
        <ProjectsTable data={data} params={params} searchParams={query} />
      </ListBody>
    </ListRegion>
  );
}
