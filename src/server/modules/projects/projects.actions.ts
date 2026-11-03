"use server";

import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "@/lib/schemas/projects";
import { adminAction } from "@/server/core/action";
import { projectTags } from "./projects.constants";
import {
  createProject,
  deleteProject,
  updateProject,
} from "./projects.service";

export const createProjectAction = adminAction(
  "project.create",
  createProjectSchema,
  async (data) => {
    const project = await createProject(data);
    return { id: project.id };
  },
  { tags: projectTags.create },
);

export const updateProjectAction = adminAction(
  "project.update",
  updateProjectSchema,
  async (data) => {
    await updateProject(data);
  },
  { tags: projectTags.update },
);

export const deleteProjectAction = adminAction(
  "project.delete",
  projectIdSchema,
  async (data) => {
    await deleteProject(data.id);
  },
  { tags: projectTags.remove },
);
