import { deleteCategory } from "@/actions/categories";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";

interface BlogCategoryTableProps {
  categories: Category[];
  isLoading: boolean;
}

export function BlogCategoryTable({
  categories,
  isLoading,
}: BlogCategoryTableProps) {
  if (isLoading) {
    return (
      <div className=" flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="p-4 text-center text-gray-500">No categories found.</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                {category.slug}
              </span>
            </TableCell>
            <TableCell>
              {new Date(category.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex justify-center items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="hidden">
                  <Link href={`/blog?category=${category.slug}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog-category/edit?id=${category.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteConfirmDialog
                  id={category.id}
                  title={category.name}
                  itemType="category"
                  onDelete={deleteCategory}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
