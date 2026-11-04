import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { PROJECT_CATEGORIES } from "@/lib/content-labels";
import { z } from "zod";
import { capturedMedia } from "@/content/project-media.generated";
import { manualMedia } from "@/content/project-media.manual";
import { projects as rawProjects } from "@/content/projects";
import { projectSchema, shotSchema } from "@/lib/schemas/content";

const publicDir = path.resolve(import.meta.dirname, "../../public");

// Projects are rows in Postgres now. These checks cover the seed data
// (src/content/projects.ts + the screenshot manifests) that fills a new
// database, so a bad entry fails here instead of in `pnpm db:seed`.
const projects = z
  .array(projectSchema)
  .parse(rawProjects)
  .map((p) => ({
    ...p,
    media: {
      shots: z
        .array(shotSchema)
        .parse([
          ...(capturedMedia[p.slug] ?? []),
          ...(manualMedia[p.slug] ?? []),
        ]),
    },
  }));

describe("project seed content", () => {
  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has projects in every category, and featured ones in the home tabs", () => {
    for (const category of PROJECT_CATEGORIES)
      expect(projects.some((p) => p.categories.includes(category))).toBe(true);
    for (const category of ["fullstack", "shopify", "automation"] as const)
      expect(
        projects.some((p) => p.featured && p.categories.includes(category)),
      ).toBe(true);
  });

  it("points every screenshot at a real file with the declared size", async () => {
    for (const project of projects)
      for (const shot of project.media.shots) {
        const file = path.join(publicDir, shot.src);
        expect(existsSync(file), shot.src).toBe(true);
        const meta = await sharp(file).metadata();
        expect([meta.width, meta.height], shot.src).toEqual([
          shot.width,
          shot.height,
        ]);
        expect(shot.alt.trim().length, shot.src).toBeGreaterThan(10);
      }
  });

  it("keeps employer work free of public links (anonymized)", () => {
    for (const project of projects)
      if (project.context === "xubitar" || project.context === "devxhub")
        expect(project.links.live, project.slug).toBeUndefined();
  });
});
