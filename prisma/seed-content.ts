import type { PrismaClient } from "../src/generated/prisma/client";
import { capturedMedia } from "../src/content/project-media.generated";
import { manualMedia } from "../src/content/project-media.manual";
import { profile, socials } from "../src/content/profile";
import { projects as rawProjects } from "../src/content/projects";
import { CATEGORY_LABELS, PROJECT_CATEGORIES } from "../src/lib/content-labels";
import {
  profileSchema,
  projectSchema,
  shotSchema,
  socialSchema,
} from "../src/lib/schemas/content";
import { z } from "zod";

// Content seed. Everything here is CREATE-ONLY: a row that already exists is
// left exactly as the admin last saved it, so re-running `pnpm db:seed` (or a
// deploy) never overwrites edits. The source of truth after seeding is the
// database; src/content stays as the initial data and the screenshots script's
// output (project-media.generated.ts is merged in only when a project is new).

export async function seedContent(prisma: PrismaClient): Promise<void> {
  const categoryIds = await seedCategories(prisma);
  await seedProjects(prisma, categoryIds);
  await seedSettings(prisma);
}

async function seedCategories(
  prisma: PrismaClient,
): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  for (const [index, slug] of PROJECT_CATEGORIES.entries()) {
    const row = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { slug, name: CATEGORY_LABELS[slug], sortOrder: index },
      select: { id: true },
    });
    ids.set(slug, row.id);
  }
  console.log(`Categories ready (${String(ids.size)}).`);
  return ids;
}

async function seedProjects(
  prisma: PrismaClient,
  categoryIds: Map<string, string>,
): Promise<void> {
  const records = z.array(projectSchema).parse(rawProjects);
  let created = 0;
  for (const [index, p] of records.entries()) {
    const exists = await prisma.project.findUnique({
      where: { slug: p.slug },
      select: { id: true },
    });
    if (exists) continue;
    const shots = z
      .array(shotSchema)
      .parse([
        ...(capturedMedia[p.slug] ?? []),
        ...(manualMedia[p.slug] ?? []),
      ]);
    await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        tagline: p.tagline,
        summary: p.summary,
        context: p.context,
        contribution: p.contribution,
        role: p.role,
        year: p.year,
        featured: p.featured,
        status: "PUBLISHED",
        sortOrder: index,
        stack: p.stack,
        problem: p.problem,
        approach: p.approach,
        outcomes: p.outcomes,
        myPart: p.myPart ?? [],
        links: p.links,
        coverArt: p.coverArt,
        media: shots,
        publishedAt: new Date(),
        categories: {
          connect: p.categories.map((slug) => {
            const id = categoryIds.get(slug);
            if (!id) throw new Error(`Unknown category "${slug}" on ${p.slug}`);
            return { id };
          }),
        },
      },
    });
    created += 1;
  }
  console.log(
    `Projects: ${String(created)} created, ${String(records.length - created)} left unchanged.`,
  );
}

async function seedSettings(prisma: PrismaClient): Promise<void> {
  const docs = [
    { key: "profile", value: profileSchema.parse(profile) },
    { key: "socials", value: z.array(socialSchema).parse(socials) },
  ];
  for (const { key, value } of docs) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log("Site settings ready (profile, socials).");
}
