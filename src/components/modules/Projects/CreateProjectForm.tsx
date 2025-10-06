"use client";

import { createProjects, updateProject } from "@/actions/projects";
import { DynamicFormField } from "@/components/shared/DynamicFormField";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
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
import { Project } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createProjectSchema = z.object({
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
  type: z
    .string()
    .trim()
    .min(2, { message: "Type must be at least 2 characters long." }),
  projectUrl: z
    .url({ message: "Please enter a valid project URL." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  codeUrl: z.url({ message: "Please enter a valid code URL." }),
  technologies: z
    .string()
    .trim()
    .min(2, { message: "Please enter at least one technology." })
    .refine((val) => val.split(",").every((tech) => tech.trim().length > 0), {
      message: "Technologies must be comma-separated values.",
    }),
});

export type CreateProjectFormTypes = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
  slug: "create" | "edit";
  project: Project | null;
}

const CreateProjectForm = ({ slug, project }: CreateProjectFormProps) => {
  const router = useRouter();
  const form = useForm<CreateProjectFormTypes>({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      content: project?.content || "",
      image: project?.image || "",
      type: project?.type || "",
      projectUrl: project?.projectUrl || "",
      codeUrl: project?.codeUrl || "",
      technologies: project?.technologies?.join(", ") || "",
    },
  });

  const onSubmit = async (values: CreateProjectFormTypes) => {
    try {
      if (slug === "create") {
        await createProjects({ data: values });
      } else if (slug === "edit" && project) {
        await updateProject({ data: values, id: Number(project.id) });
      }

      toast.success(
        slug === "create"
          ? "Project created successfully!"
          : "Project updated successfully!"
      );
      router.push("/projects");
      form.reset();
    } catch (error) {
      console.error(`Failed to ${slug} project:`, error);
      toast.error(`Failed to ${slug} project. Please try again later.`);
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
            {(field) => <Input {...field} placeholder="Title" />}
          </DynamicFormField>
          <DynamicFormField name="description" label="Description *">
            {(field) => <Textarea {...field} placeholder="Description" />}
          </DynamicFormField>
          <DynamicFormField name="content" label="Content *">
            {(field) => (
              <RichTextEditor
                placeholder="Write your project details..."
                height={250}
                defaultValue={field.value}
                onChange={(html) => field.onChange(html)}
              />
            )}
          </DynamicFormField>
          <DynamicFormField name="image" label="Image URL *">
            {(field) => <Input {...field} placeholder="Image URL" />}
          </DynamicFormField>
          <DynamicFormField name="type" label="Type *">
            {(field) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Fullstack">Fullstack</SelectItem>
                </SelectContent>
              </Select>
            )}
          </DynamicFormField>
          <DynamicFormField name="projectUrl" label="Project URL">
            {(field) => <Input {...field} placeholder="Project URL" />}
          </DynamicFormField>
          <DynamicFormField name="codeUrl" label="Code URL *">
            {(field) => <Input {...field} placeholder="Code URL" />}
          </DynamicFormField>
          <DynamicFormField name="technologies" label="Technologies *">
            {(field) => <Input {...field} placeholder="Technologies" />}
          </DynamicFormField>

          <Button type="submit" className="w-full">
            {slug === "create" ? "Create" : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProjectForm;
