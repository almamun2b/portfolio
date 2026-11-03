import "server-only";
import {
  projectBodySchema,
  projectIdSchema,
  projectListParamsSchema,
} from "@/lib/schemas/projects";
import { AppError } from "@/server/core/errors/app-error";
import { apiRoute } from "@/server/core/http/route";
import { projectTags } from "./projects.constants";
import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
} from "./projects.service";

export const listProjectsRoute = apiRoute(
  { name: "projects.list", auth: "admin", query: projectListParamsSchema },
  ({ query }) => listProjects(query),
);

export const createProjectRoute = apiRoute(
  {
    name: "projects.create",
    auth: "admin",
    body: projectBodySchema,
    status: 201,
    message: "Project created.",
    tags: () => projectTags.create(),
  },
  ({ body }) => createProject(body),
);

export const getProjectRoute = apiRoute(
  { name: "projects.get", auth: "admin", params: projectIdSchema },
  async ({ params }) => {
    const project = await getProjectById(params.id);
    if (!project) throw AppError.notFound("That project no longer exists.");
    return project;
  },
);

export const updateProjectRoute = apiRoute(
  {
    name: "projects.update",
    auth: "admin",
    params: projectIdSchema,
    body: projectBodySchema,
    message: "Project updated.",
    tags: ({ params }) => projectTags.update(params),
  },
  ({ params, body }) => updateProject({ id: params.id, ...body }),
);

export const deleteProjectRoute = apiRoute(
  {
    name: "projects.delete",
    auth: "admin",
    params: projectIdSchema,
    message: "Project deleted.",
    tags: ({ params }) => projectTags.remove(params),
  },
  async ({ params }) => {
    await deleteProject(params.id);
    return null;
  },
);
