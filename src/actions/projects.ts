"use server";

import { CreateProjectFormTypes } from "@/components/modules/Projects/CreateProjectForm";
import { revalidateTag } from "next/cache";

export const createProjects = async ({
  data,
}: {
  data: CreateProjectFormTypes;
}) => {
  const technologyArray = data.technologies
    .toString()
    .split(",")
    .map((tech) => tech.trim());

  const modifiedProjectInfo = {
    ...data,
    technologies: technologyArray,
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifiedProjectInfo),
  });

  const result = await res.json();
  if (result.success) {
    revalidateTag("PROJECTS");
  }
  return result;
};

export const updateProject = async ({
  data,
  id,
}: {
  data: CreateProjectFormTypes;
  id: number;
}) => {
  const technologyArray = data.technologies
    .toString()
    .split(",")
    .map((tech) => tech.trim());

  const modifiedProjectInfo = {
    ...data,
    technologies: technologyArray,
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modifiedProjectInfo),
  });

  const result = await res.json();
  if (result.success) {
    revalidateTag("PROJECTS");
  }
  return result;
};

export const deleteProject = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  if (result.success) {
    revalidateTag("PROJECTS");
  }
  return result;
};
