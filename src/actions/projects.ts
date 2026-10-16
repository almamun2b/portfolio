"use server";

import { CreateProjectFormTypes } from "@/components/modules/Projects/CreateProjectForm";
import {
  createProjectRecord,
  deleteProjectRecord,
  updateProjectRecord,
} from "@/lib/queries";
import { revalidateTag } from "next/cache";

const asProjectType = (type: string) =>
  type === "Backend" || type === "Fullstack" ? type : "Frontend";

const toTechArray = (technologies: string | string[]) =>
  (Array.isArray(technologies) ? technologies : technologies.split(","))
    .map((tech) => tech.trim())
    .filter(Boolean);

export const createProjects = async ({
  data,
}: {
  data: CreateProjectFormTypes;
}) => {
  try {
    const project = await createProjectRecord({
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image || null,
      type: asProjectType(data.type),
      projectUrl: data.projectUrl || null,
      codeUrl: data.codeUrl || null,
      technologies: toTechArray(data.technologies),
    });
    revalidateTag("PROJECTS");
    return { success: true, message: "Project created successfully", data: project };
  } catch (error) {
    console.error("createProjects failed:", error);
    return { success: false, message: "Failed to create project" };
  }
};

export const updateProject = async ({
  data,
  id,
}: {
  data: CreateProjectFormTypes;
  id: number;
}) => {
  try {
    const project = await updateProjectRecord(id, {
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image || null,
      type: asProjectType(data.type),
      projectUrl: data.projectUrl || null,
      codeUrl: data.codeUrl || null,
      technologies: toTechArray(data.technologies),
    });
    revalidateTag("PROJECTS");
    return { success: true, message: "Project updated successfully", data: project };
  } catch (error) {
    console.error("updateProject failed:", error);
    return { success: false, message: "Failed to update project" };
  }
};

export const deleteProject = async (id: number) => {
  try {
    await deleteProjectRecord(id);
    revalidateTag("PROJECTS");
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("deleteProject failed:", error);
    return { success: false, message: "Failed to delete project" };
  }
};
