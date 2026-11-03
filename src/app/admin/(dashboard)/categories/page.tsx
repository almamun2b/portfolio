import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { ListBody, ListRegion } from "@/components/ui/list-region";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { categoryListParamsSchema } from "@/lib/schemas/categories";
import { first, firstOf, withParams } from "@/lib/url-state";
import { requireAdmin } from "@/server/modules/auth/auth.guard";
import { listCategories } from "@/server/modules/categories/categories.service";
import { AddCategoryButton } from "./_components/add-category-button";
import { CategoriesTable } from "./_components/categories-table";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage({
  searchParams,
}: PageProps<"/admin/categories">) {
  await requireAdmin();
  const query = await searchParams;
  const params = categoryListParamsSchema.parse(
    firstOf(query, ["page", "limit", "searchTerm", "sortBy", "sortOrder"]),
  );
  const data = await listCategories(params);
  if (data.meta.total > 0 && params.page > data.meta.totalPage) {
    redirect(
      withParams("/admin/categories", query, {
        page: data.meta.totalPage,
      }) as Route,
    );
  }

  return (
    <ListRegion>
      <PageHeader
        title="Categories"
        description="One list shared by projects and blog posts. A category shows on the public site once it has a published project or post."
        actions={<AddCategoryButton />}
      />
      <SearchInput
        action="/admin/categories"
        label="Search categories"
        placeholder="Search by name or slug"
        defaultValue={params.searchTerm}
        preserve={{
          sortBy: first(query.sortBy),
          sortOrder: first(query.sortOrder),
          limit: first(query.limit),
        }}
      />
      <ListBody>
        <CategoriesTable data={data} params={params} searchParams={query} />
      </ListBody>
    </ListRegion>
  );
}
