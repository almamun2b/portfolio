import { describe, expect, it } from "vitest";
import {
  CONTACT_LIMITS,
  composeMailto,
  composeWebmail,
  validateContact,
} from "@/lib/contact";
import { contactSchema } from "@/lib/schemas/contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "",
  body: "We are hiring a full-stack engineer for a Next.js product.",
};

describe("validateContact", () => {
  it("accepts a complete message and trims it", () => {
    const result = validateContact({ ...valid, name: "  Ada Lovelace " });
    expect(result).toEqual({
      ok: true,
      data: { ...valid, name: "Ada Lovelace" },
    });
  });

  it("reports every invalid field", () => {
    const result = validateContact({ name: "A", email: "nope", body: "hi" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(Object.keys(result.errors).sort()).toEqual([
        "body",
        "email",
        "name",
      ]);
  });

  it("rejects a body too long for a mailto: link", () => {
    const body = "x".repeat(CONTACT_LIMITS.bodyMax + 1);
    expect(validateContact({ ...valid, body }).ok).toBe(false);
  });

  it("agrees with the server-side zod schema", () => {
    for (const input of [
      valid,
      { ...valid, body: "short" },
      { ...valid, email: "bad" },
      { ...valid, body: "x".repeat(CONTACT_LIMITS.bodyMax + 1) },
    ]) {
      expect(validateContact(input).ok).toBe(
        contactSchema.safeParse(input).success,
      );
    }
  });
});

describe("composeMailto", () => {
  it("signs the body and encodes spaces as %20, not +", () => {
    const url = composeMailto("me@example.com", valid);
    expect(url.startsWith("mailto:me@example.com?")).toBe(true);
    expect(url).not.toContain("+");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Portfolio enquiry from Ada Lovelace");
    expect(params.get("body")).toContain("Ada Lovelace\nada@example.com");
  });

  it("uses a custom subject when given", () => {
    const url = composeMailto("me@example.com", { ...valid, subject: "Role" });
    expect(new URLSearchParams(url.split("?")[1]).get("subject")).toBe("Role");
  });

  it("keeps ordinary text at the limit under ~2,000 characters", () => {
    const sentence = "We are building a Shopify app and need help with it. ";
    const body = sentence
      .repeat(Math.ceil(CONTACT_LIMITS.bodyMax / sentence.length))
      .slice(0, CONTACT_LIMITS.bodyMax);
    expect(
      composeMailto("me@example.com", { ...valid, body }).length,
    ).toBeLessThan(2000);
  });
});

describe("composeWebmail", () => {
  it("builds Gmail and Outlook compose links with the same message", () => {
    const { gmail, outlook } = composeWebmail("me@example.com", valid);
    const g = new URL(gmail);
    const o = new URL(outlook);
    expect(g.hostname).toBe("mail.google.com");
    expect(g.searchParams.get("to")).toBe("me@example.com");
    expect(o.hostname).toBe("outlook.office.com");
    expect(o.searchParams.get("body")).toBe(g.searchParams.get("body"));
  });
});
