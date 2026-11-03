import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";
import { categoryBodySchema } from "@/lib/schemas/categories";
import { contactMessageSchema } from "@/lib/schemas/messages";
import { postBodySchema } from "@/lib/schemas/posts";
import { projectBodySchema } from "@/lib/schemas/projects";
import {
  checkbox,
  csvField,
  imageUrlSchema,
  jsonField,
  linesField,
  slugSchema,
} from "@/lib/schemas/form-helpers";
import { profileFormSchema } from "@/lib/schemas/settings";
import {
  toProfile,
  toProfileForm,
} from "@/server/modules/settings/settings.model";

describe("form helpers", () => {
  it("reads comma lists, lines, checkboxes, and JSON from form strings or native values", () => {
    expect(csvField(slugSchema).parse("a-b, c-d")).toEqual(["a-b", "c-d"]);
    expect(csvField(slugSchema).parse(["a-b"])).toEqual(["a-b"]);
    expect(linesField().parse("one\n\n two \r\nthree")).toEqual([
      "one",
      "two",
      "three",
    ]);
    expect(checkbox.parse("on")).toBe(true);
    expect(checkbox.parse(undefined)).toBe(false);
    expect(jsonField(csvField(slugSchema)).parse('["a-b"]')).toEqual(["a-b"]);
    expect(jsonField(csvField(slugSchema)).safeParse("{not json").success).toBe(
      false,
    );
  });

  it("only accepts https URLs and /public paths for images", () => {
    expect(
      imageUrlSchema.safeParse("https://cdn.example.com/a.jpg").success,
    ).toBe(true);
    expect(imageUrlSchema.safeParse("/projects/x/shot.jpg").success).toBe(true);
    for (const bad of [
      "http://a.test/x.jpg",
      "//evil.test/x.jpg",
      "javascript:alert(1)",
      "data:image/png;base64,AA",
    ])
      expect(imageUrlSchema.safeParse(bad).success, bad).toBe(false);
  });

  it("slugs are lowercase words with single dashes", () => {
    expect(slugSchema.parse(" My-Post ")).toBe("my-post");
    for (const bad of [
      "a",
      "has space",
      "-lead",
      "trail-",
      "double--dash",
      "__none__",
    ])
      expect(slugSchema.safeParse(bad).success, bad).toBe(false);
  });
});

const project = {
  title: "A project",
  slug: "a-project",
  tagline: "A tagline that is long enough.",
  summary: "A summary that is long enough to pass the check.",
  context: "personal",
  contribution: "owner",
  role: "Sole developer",
  year: "2026",
  stack: "react,nextjs",
  problem: "The problem statement.",
  approach: "First\nSecond",
  outcomes: "One",
  categoryIds: ["c1", "c2"],
};

describe("project form schema", () => {
  it("accepts what the form sends and what the API sends", () => {
    const fromForm = projectBodySchema.parse({
      ...project,
      featured: "on",
      media: "[]",
      sortOrder: "",
    });
    expect(fromForm.stack).toEqual(["react", "nextjs"]);
    expect(fromForm.approach).toEqual(["First", "Second"]);
    expect(fromForm.featured).toBe(true);
    expect(fromForm.sortOrder).toBeUndefined();
    expect(fromForm.status).toBe("DRAFT");
    const fromApi = projectBodySchema.parse({
      ...project,
      stack: ["react"],
      approach: ["A"],
      outcomes: ["B"],
      featured: false,
      media: [{ src: "/x.jpg", alt: "x", device: "desktop" }],
    });
    expect(fromApi.media).toHaveLength(1);
  });

  it("reports field errors for the things an editor can get wrong", () => {
    const result = projectBodySchema.safeParse({
      ...project,
      stack: "",
      categoryIds: "",
      year: "26",
      liveUrl: "not a url",
    });
    expect(result.success).toBe(false);
    const fields = new Set(result.error?.issues.map((i) => String(i.path[0])));
    expect([...fields]).toEqual(
      expect.arrayContaining(["stack", "categoryIds", "year", "liveUrl"]),
    );
  });

  it("rejects an unknown technology", () => {
    expect(
      projectBodySchema.safeParse({ ...project, stack: "cobol" }).success,
    ).toBe(false);
  });
});

describe("post, category, and contact schemas", () => {
  it("parses a post with optional fields empty", () => {
    const post = postBodySchema.parse({
      title: "A post",
      slug: "a-post",
      excerpt: "A summary that is long enough.",
      body: "<p>Hello</p>",
      coverUrl: "",
      coverAlt: "",
      seoTitle: "",
      publishedAt: "",
    });
    expect(post.coverUrl).toBeUndefined();
    expect(post.status).toBe("DRAFT");
    expect(post.categoryIds).toEqual([]);
  });

  it("defaults a category's order", () => {
    expect(
      categoryBodySchema.parse({ name: "Web", slug: "web" }).sortOrder,
    ).toBe(0);
  });

  it("contact messages need a real email and body; the honeypot must stay empty", () => {
    const base = {
      name: "Ada",
      email: "ADA@Example.com",
      body: "Hello there, I have a project.",
    };
    expect(contactMessageSchema.parse(base).email).toBe("ada@example.com");
    expect(
      contactMessageSchema.safeParse({ ...base, body: "short" }).success,
    ).toBe(false);
    expect(
      contactMessageSchema.safeParse({ ...base, email: "nope" }).success,
    ).toBe(false);
    expect(
      contactMessageSchema.safeParse({ ...base, website: "http://spam.test" })
        .success,
    ).toBe(false);
  });
});

describe("profile settings", () => {
  it("round-trips the stored profile through the settings form", () => {
    const form = profileFormSchema.parse(toProfileForm(profile));
    expect(toProfile(form)).toEqual(profile);
  });

  it("rejects a malformed WhatsApp number", () => {
    const result = profileFormSchema.safeParse({
      ...toProfileForm(profile),
      whatsapp: "12",
    });
    expect(result.success).toBe(false);
  });
});
