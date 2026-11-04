import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/server/core/errors/app-error";
import { normalizeError } from "@/server/core/errors/normalize";

vi.mock("@/server/core/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const context = { requestId: "req12345", name: "test" };

function known(code: string, meta?: Record<string, unknown>) {
  return new Prisma.PrismaClientKnownRequestError("boom", {
    code,
    clientVersion: "test",
    meta,
  });
}

describe("normalizeError", () => {
  it("passes an AppError through with its own status and message", () => {
    const result = normalizeError(
      AppError.conflict("Taken.", { a: ["x"] }),
      context,
    );
    expect(result).toMatchObject({
      statusCode: 409,
      code: "CONFLICT",
      message: "Taken.",
      fieldErrors: { a: ["x"] },
      requestId: "req12345",
    });
  });

  it("maps a Zod error to 400 with field errors", () => {
    const parsed = z.object({ email: z.email() }).safeParse({ email: "no" });
    const result = normalizeError(parsed.error, context);
    expect(result.statusCode).toBe(400);
    expect(result.code).toBe("VALIDATION_ERROR");
    expect(result.fieldErrors?.email).toHaveLength(1);
  });

  it.each([
    ["P2002", 409, "CONFLICT"],
    ["P2025", 404, "NOT_FOUND"],
    ["P2003", 400, "BAD_REQUEST"],
    ["P1001", 503, "DATABASE_ERROR"],
    ["P9999", 500, "DATABASE_ERROR"],
  ])("maps Prisma %s to %i %s", (code, status, mapped) => {
    const result = normalizeError(known(code), context);
    expect(result.statusCode).toBe(status);
    expect(result.code).toBe(mapped);
  });

  it("names the unique field for P2002", () => {
    const result = normalizeError(
      known("P2002", { target: ["email"] }),
      context,
    );
    expect(Object.keys(result.fieldErrors ?? {})).toEqual(["email"]);
  });

  it("hides the details of an unknown error behind the reference id", () => {
    const result = normalizeError(
      new Error("password=hunter2 in query"),
      context,
    );
    expect(result.statusCode).toBe(500);
    expect(result.code).toBe("INTERNAL_ERROR");
    expect(result.message).toContain("req12345");
    expect(result.message).not.toContain("hunter2");
  });
});
