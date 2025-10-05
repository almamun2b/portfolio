import PaginationCommon from "@/components/shared/pagination-common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types";
import Link from "next/link";
import { ProjectsTable } from "./ProjectsTable";

interface AllProjectProps {
  projects: Project[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AllProject({ projects, meta }: AllProjectProps) {
  return (
    <main className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>All Projects</CardTitle>
          <Button asChild variant="default" size="lg">
            <Link href="/projects/create">New Project</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}

          {/* Table */}
          <ProjectsTable projects={projects} isLoading={false} />

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <PaginationCommon
                currentPage={meta.page}
                totalPages={meta.totalPages}
                paginationItemsToDisplay={5}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
