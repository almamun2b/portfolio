import type { Paginated, ProjectAdminDTO } from "@/lib/dto";
import {
  DEFAULT_SHOT_SIZE,
  projectBodySchema,
  type ProjectBody,
  type ProjectInput,
  type ProjectListParams,
  type UpdateProjectInput,
} from "@/lib/schemas/projects";
import { writeAudit } from "@/server/core/audit";
import { CACHE_TAGS } from "@/server/core/cache";
import { db } from "@/server/core/db";
import { AppError } from "@/server/core/errors/app-error";
import { assertAdmin, requireAdmin } from "@/server/modules/auth/auth.guard";
import { cacheLife, cacheTag } from "next/cache";
import { QueryBuilder } from "query-builder-prisma";
import "server-only";
import { isUniqueViolation } from "../categories/categories.model";
import { PROJECT_SEARCHABLE_FIELDS } from "./projects.constants";
import {
  projectSelect,
  toProjectAdminDTO,
  type ProjectRow,
} from "./projects.model";

const slugTaken = () =>
  AppError.conflict("That slug is already in use.", {
    slug: ["That slug is already in use."],
  });
const gone = () => AppError.notFound("That project no longer exists.");

// ---- reads -----------------------------------------------------------------

export async function listProjects(
  params: ProjectListParams,
): Promise<Paginated<ProjectAdminDTO>> {
  await requireAdmin();
  return listProjectsCached(params);
}

async function listProjectsCached(
  params: ProjectListParams,
): Promise<Paginated<ProjectAdminDTO>> {
  "use cache";
  cacheTag(CACHE_TAGS.PROJECTS);
  cacheLife("admin");
  const { data, meta } = await new QueryBuilder(db.project)
    .search({
      searchText: params.searchTerm,
      fields: [...PROJECT_SEARCHABLE_FIELDS],
    })
    .filter({ status: params.status })
    .orderBy([{ [params.sortBy]: params.sortOrder }, { id: "asc" }])
    .paginate({ page: params.page, limit: params.limit })
    .select(projectSelect)
    .executeWithMeta();
  return {
    data: data.map((row) => toProjectAdminDTO(row as ProjectRow)),
    meta,
  };
}

export async function getProjectById(
  id: string,
): Promise<ProjectAdminDTO | null> {
  await requireAdmin();
  return getProjectByIdCached(id);
}

async function getProjectByIdCached(
  id: string,
): Promise<ProjectAdminDTO | null> {
  "use cache";
  cacheTag(CACHE_TAGS.PROJECTS, CACHE_TAGS.project(id));
  cacheLife("admin");
  const row = await db.project.findUnique({
    where: { id },
    select: projectSelect,
  });
  return row ? toProjectAdminDTO(row) : null;
}

// ---- writes ----------------------------------------------------------------

function toData(data: ProjectBody) {
  const links: Record<string, string> = {};
  if (data.liveUrl) links.live = data.liveUrl;
  if (data.sourceUrl) links.source = data.sourceUrl;
  if (data.apiUrl) links.api = data.apiUrl;
  if (data.apiSourceUrl) links.apiSource = data.apiSourceUrl;
  return {
    title: data.title,
    slug: data.slug,
    tagline: data.tagline,
    summary: data.summary,
    context: data.context,
    contribution: data.contribution,
    role: data.role,
    year: data.year,
    featured: data.featured,
    status: data.status,
    stack: data.stack,
    problem: data.problem,
    approach: data.approach,
    outcomes: data.outcomes,
    myPart: data.myPart,
    links,
    coverArt: data.coverArt,
    media: data.media.map((shot) => ({
      src: shot.src,
      alt: shot.alt,
      device: shot.device,
      width: shot.width ?? DEFAULT_SHOT_SIZE[shot.device].width,
      height: shot.height ?? DEFAULT_SHOT_SIZE[shot.device].height,
    })),
  };
}

async function assertCategories(ids: string[]): Promise<void> {
  const found = await db.category.count({ where: { id: { in: ids } } });
  if (found !== ids.length) {
    throw AppError.validation("Unknown category.", {
      categoryIds: ["One of the selected categories no longer exists."],
    });
  }
}

async function nextSortOrder(): Promise<number> {
  const last = await db.project.aggregate({ _max: { sortOrder: true } });
  return (last._max.sortOrder ?? -1) + 1;
}

/** Publishing stamps `publishedAt` once; going back to draft keeps it. */
function publishedAtFor(
  status: "DRAFT" | "PUBLISHED",
  existing: Date | null,
): Date | null {
  return status === "PUBLISHED" ? (existing ?? new Date()) : existing;
}

export async function createProject(
  input: ProjectInput,
): Promise<ProjectAdminDTO> {
  const actor = await assertAdmin();
  const parsed = projectBodySchema.parse(input);
  await assertCategories(parsed.categoryIds);
  const data = toData(parsed);
  const sortOrder = parsed.sortOrder ?? (await nextSortOrder());
  try {
    const row = await db.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          ...data,
          sortOrder,
          publishedAt: publishedAtFor(data.status, null),
          categories: { connect: parsed.categoryIds.map((id) => ({ id })) },
        },
        select: projectSelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "project.create",
          targetType: "project",
          targetId: created.id,
          metadata: { slug: data.slug, status: data.status },
        },
        tx,
      );
      return created;
    });
    return toProjectAdminDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw slugTaken();
    throw error;
  }
}

export async function updateProject(
  input: UpdateProjectInput,
): Promise<ProjectAdminDTO> {
  const actor = await assertAdmin();
  const { id, ...rest } = input;
  const parsed = projectBodySchema.parse(rest);
  const before = await db.project.findUnique({
    where: { id },
    select: { slug: true, status: true, sortOrder: true, publishedAt: true },
  });
  if (!before) throw gone();
  await assertCategories(parsed.categoryIds);
  const data = toData(parsed);
  try {
    const row = await db.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id },
        data: {
          ...data,
          sortOrder: parsed.sortOrder ?? before.sortOrder,
          publishedAt: publishedAtFor(data.status, before.publishedAt),
          categories: { set: parsed.categoryIds.map((cid) => ({ id: cid })) },
        },
        select: projectSelect,
      });
      await writeAudit(
        {
          actorId: actor.id,
          action: "project.update",
          targetType: "project",
          targetId: id,
          metadata: {
            from: { slug: before.slug, status: before.status },
            to: { slug: data.slug, status: data.status },
          },
        },
        tx,
      );
      return updated;
    });
    return toProjectAdminDTO(row);
  } catch (error) {
    if (isUniqueViolation(error)) throw slugTaken();
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const actor = await assertAdmin();
  const target = await db.project.findUnique({
    where: { id },
    select: { slug: true, title: true },
  });
  if (!target) throw gone();
  await db.$transaction(async (tx) => {
    await writeAudit(
      {
        actorId: actor.id,
        action: "project.delete",
        targetType: "project",
        targetId: id,
        metadata: target,
      },
      tx,
    );
    await tx.project.delete({ where: { id } });
  });
}
