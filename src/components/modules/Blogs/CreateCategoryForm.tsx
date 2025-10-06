"use client";

import { createCategory, updateCategory } from "@/actions/categories";
import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Category name must be at least 2 characters long." }),
});

export type CreateCategoryFormTypes = z.infer<typeof createCategorySchema>;

interface CreateCategoryFormProps {
  slug: "create" | "edit";
  category: Category | null;
}

const CreateCategoryForm = ({ slug, category }: CreateCategoryFormProps) => {
  const router = useRouter();
  const form = useForm<CreateCategoryFormTypes>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: category?.name || "",
    },
  });

  const onSubmit = async (values: CreateCategoryFormTypes) => {
    try {
      let result;
      if (slug === "create") {
        result = await createCategory({ data: values });
      } else if (slug === "edit" && category) {
        result = await updateCategory({
          data: values,
          id: Number(category.id),
        });
      }

      if (result?.success) {
        toast.success(
          slug === "create"
            ? "Category created successfully!"
            : "Category updated successfully!"
        );
        router.push("/blog-category");
        form.reset();
      } else {
        toast.error(result?.message || `Failed to ${slug} category.`);
      }
    } catch (error) {
      console.error(`Failed to ${slug} category:`, error);
      toast.error(`Failed to ${slug} category. Please try again later.`);
    }
  };

  return (
    <div className="mx-auto container px-4 lg:px-8 max-w-3xl pt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm"
        >
          <DynamicFormField name="name" label="Category Name *">
            {(field) => <Input {...field} placeholder="Enter category name" />}
          </DynamicFormField>

          <Button type="submit" className="w-full">
            {slug === "create" ? "Create Category" : "Update Category"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCategoryForm;
