"use client";

// import type { CreateBlogForm } from "@/actions/blogs";
import { createBlog, updateBlog } from "@/actions/blogs";
import { DynamicFormField } from "@/components/shared/DynamicFormField";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Blog, Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Title must be at least 2 characters long." }),
  description: z
    .string()
    .trim()
    .min(2, { message: "Description must be at least 2 characters long." }),
  content: z
    .string()
    .trim()
    .min(2, { message: "Content must be at least 2 characters long." }),
  image: z.url({ message: "Please enter a valid image URL." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  tags: z
    .string()
    .trim()
    .min(2, { message: "Please enter at least one tag." })
    .refine((val) => val.split(",").every((tag) => tag.trim().length > 0), {
      message: "Tags must be comma-separated values.",
    }),
  isFeatured: z.boolean(),
});

export type CreateBlogFormTypes = z.infer<typeof createBlogSchema>;

interface CreateBlogFormProps {
  slug: "create" | "edit";
  blog: Blog | null;
  categories: Category[];
}

const CreateBlogForm = ({ slug, blog, categories }: CreateBlogFormProps) => {
  const router = useRouter();
  const form = useForm<CreateBlogFormTypes>({
    resolver: zodResolver(createBlogSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: blog?.title || "",
      description: blog?.description || "",
      content: blog?.content || "",
      image: blog?.image || "",
      categoryId: blog?.category?.id?.toString() || "",
      tags: blog?.tags?.join(", ") || "",
      isFeatured: blog?.isFeatured || false,
    },
  });

  const onSubmit = async (values: CreateBlogFormTypes) => {
    try {
      let result;
      // Convert form data to match action interface
      const actionData: CreateBlogFormTypes = {
        title: values.title,
        description: values.description,
        content: values.content,
        image: values.image,
        categoryId: values.categoryId,
        tags: values.tags,
        isFeatured: values.isFeatured,
      };

      if (slug === "create") {
        result = await createBlog({ data: actionData });
      } else if (slug === "edit" && blog) {
        result = await updateBlog({ data: actionData, id: Number(blog.id) });
      }

      if (result?.success) {
        toast.success(
          slug === "create"
            ? "Blog created successfully!"
            : "Blog updated successfully!"
        );
        router.push("/blogs");
        form.reset();
      } else {
        toast.error(result?.message || `Failed to ${slug} blog.`);
      }
    } catch (error) {
      console.error(`Failed to ${slug} blog:`, error);
      toast.error(`Failed to ${slug} blog. Please try again later.`);
    }
  };

  return (
    <div className="mx-auto container px-4 lg:px-8 max-w-5xl pt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm"
        >
          <DynamicFormField name="title" label="Title *">
            {(field) => <Input {...field} placeholder="Blog title" />}
          </DynamicFormField>

          <DynamicFormField name="description" label="Description *">
            {(field) => <Textarea {...field} placeholder="Blog description" />}
          </DynamicFormField>

          <DynamicFormField name="content" label="Content *">
            {(field) => (
              <RichTextEditor
                placeholder="Write your blog content..."
                height={300}
                defaultValue={field.value}
                onChange={(html) => field.onChange(html)}
              />
            )}
          </DynamicFormField>

          <DynamicFormField name="image" label="Image URL *">
            {(field) => (
              <Input {...field} placeholder="https://example.com/image.jpg" />
            )}
          </DynamicFormField>

          <DynamicFormField name="categoryId" label="Category *">
            {(field) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </DynamicFormField>

          <DynamicFormField name="tags" label="Tags *">
            {(field) => (
              <Input
                {...field}
                placeholder="React, JavaScript, Web Development (comma-separated)"
              />
            )}
          </DynamicFormField>

          <DynamicFormField name="isFeatured" label="Featured Blog">
            {(field) => (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isFeatured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as featured blog
                </label>
              </div>
            )}
          </DynamicFormField>

          <Button type="submit" className="w-full">
            {slug === "create" ? "Create Blog" : "Update Blog"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBlogForm;
