import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { PROJECT_CATEGORIES } from "@/lib/content-labels";
import {
  getProjects,
  getProjectBySlug,
} from "@/server/modules/content/projects.service";

const publicDir = path.resolve(import.meta.dirname, "../../public");

describe("project content", async () => {
  const projects = await getProjects();

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolves every slug", async () => {
    for (const { slug } of projects)
      expect((await getProjectBySlug(slug))?.slug).toBe(slug);
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
