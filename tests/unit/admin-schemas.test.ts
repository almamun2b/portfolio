import { describe, expect, it } from "vitest";
import { changePasswordSchema, signInSchema } from "@/lib/schemas/auth";
import { auditListParamsSchema } from "@/lib/schemas/audit";
import { passwordSchema } from "@/lib/schemas/common";
import {
  createUserSchema,
  setPasswordSchema,
  updateUserSchema,
  userListParamsSchema,
} from "@/lib/schemas/users";

const GOOD = "Sup3r-secret-pass";

describe("passwordSchema", () => {
  it("accepts a long mixed-case password with a number", () => {
    expect(passwordSchema.safeParse(GOOD).success).toBe(true);
  });

  it.each([
    ["too short", "Ab1"],
    ["no number", "Supersecretpassword"],
    ["no upper case", "supersecret-pass-1"],
    ["no lower case", "SUPERSECRET-PASS-1"],
    ["too long", `Aa1${"x".repeat(130)}`],
  ])("rejects %s", (_name, value) => {
    expect(passwordSchema.safeParse(value).success).toBe(false);
  });
});

describe("createUserSchema", () => {
  const base = {
    name: "  Jane Tester ",
    email: " JANE@Example.com ",
    password: GOOD,
    confirmPassword: GOOD,
  };

  it("trims the name and lower-cases the email", () => {
    const parsed = createUserSchema.parse(base);
    expect(parsed.name).toBe("Jane Tester");
    expect(parsed.email).toBe("jane@example.com");
  });

  it("flags a confirmation mismatch on confirmPassword", () => {
    const result = createUserSchema.safeParse({
      ...base,
      confirmPassword: "nope",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });

  it("rejects an invalid email", () => {
    expect(
      createUserSchema.safeParse({ ...base, email: "not-an-email" }).success,
    ).toBe(false);
  });
});

describe("other user schemas", () => {
  it("requires an id when updating", () => {
    expect(
      updateUserSchema.safeParse({
        id: "",
        name: "Jo",
        email: "jo@example.com",
      }).success,
    ).toBe(false);
  });

  it("checks the confirmation when setting a password", () => {
    expect(
      setPasswordSchema.safeParse({
        id: "u1",
        password: GOOD,
        confirmPassword: GOOD,
      }).success,
    ).toBe(true);
    expect(
      setPasswordSchema.safeParse({
        id: "u1",
        password: GOOD,
        confirmPassword: "x",
      }).success,
    ).toBe(false);
  });
});

describe("signInSchema", () => {
  it("does not apply the password policy (it must not reveal the rules)", () => {
    expect(
      signInSchema.safeParse({ email: "a@b.co", password: "x" }).success,
    ).toBe(true);
  });

  it("requires both fields", () => {
    expect(signInSchema.safeParse({ email: "", password: "" }).success).toBe(
      false,
    );
  });
});

describe("changePasswordSchema", () => {
  const ok = {
    currentPassword: "old-pass",
    newPassword: GOOD,
    confirmPassword: GOOD,
  };

  it("accepts a valid change", () => {
    expect(changePasswordSchema.safeParse(ok).success).toBe(true);
  });

  it("rejects reusing the current password", () => {
    const r = changePasswordSchema.safeParse({ ...ok, currentPassword: GOOD });
    expect(r.error?.issues.some((i) => i.path[0] === "newPassword")).toBe(true);
  });
});

describe("list params", () => {
  it("falls back to defaults instead of throwing on a hand-edited URL", () => {
    const params = userListParamsSchema.parse({
      page: "-4",
      limit: "9999",
      sortBy: "passwordHash",
      sortOrder: "sideways",
      status: "DELETED",
      searchTerm: undefined,
    });
    expect(params).toEqual({
      page: 1,
      limit: 10,
      searchTerm: "",
      status: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("keeps valid values", () => {
    const params = userListParamsSchema.parse({
      page: "3",
      limit: "25",
      sortBy: "email",
      sortOrder: "asc",
      status: "ACTIVE",
      searchTerm: " jo ",
    });
    expect(params).toMatchObject({
      page: 3,
      limit: 25,
      sortBy: "email",
      sortOrder: "asc",
      status: "ACTIVE",
      searchTerm: "jo",
    });
  });

  it("audit params fall back the same way", () => {
    expect(
      auditListParamsSchema.parse({ area: "x", page: "abc" }),
    ).toMatchObject({ page: 1, area: undefined });
  });
});
