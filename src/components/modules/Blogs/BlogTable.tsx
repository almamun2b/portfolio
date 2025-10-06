import { deleteBlog } from "@/actions/blogs";
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
import { Blog } from "@/types";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";

interface BlogTableProps {
  blogs: Blog[];
  isLoading: boolean;
}

export function BlogTable({ blogs, isLoading }: BlogTableProps) {
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

  if (!blogs?.length) {
    return <div className="p-4 text-center text-gray-500">No blogs found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog.id}>
            <TableCell>{blog.id}</TableCell>
            <TableCell className="font-medium">{blog.title}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                {blog.category.name}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{blog.tags.length - 3} more
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                {blog.views}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  blog.isFeatured
                    ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-700/10"
                    : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
                }`}
              >
                {blog.isFeatured ? "Featured" : "Regular"}
              </span>
            </TableCell>
            <TableCell>
              {new Date(blog.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${blog.slug}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blogs/edit?id=${blog.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteConfirmDialog
                  id={blog.id}
                  title={blog.title}
                  itemType="blog"
                  onDelete={deleteBlog}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
