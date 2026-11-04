import { Prisma } from "@/generated/prisma/client";
import { HTTP_STATUS } from "./codes";
import type { Normalized } from "./normalize";

// Connection and availability problems (Prisma error reference, P1xxx).
const UNAVAILABLE = new Set([
  "P1000",
  "P1001",
  "P1002",
  "P1003",
  "P1008",
  "P1010",
  "P1011",
  "P1017",
]);

function target(error: Prisma.PrismaClientKnownRequestError): string {
  const raw = error.meta?.target;
  if (Array.isArray(raw)) return raw.join(", ");
  return typeof raw === "string" ? raw : "";
}

export function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError
  );
}

export function handlePrismaError(error: unknown): Normalized {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = target(error);
      return {
        statusCode: HTTP_STATUS.CONFLICT,
        code: "CONFLICT",
        message: "That record already exists.",
        fieldErrors: field
          ? { [field]: ["This value is already in use."] }
          : undefined,
      };
    }
    if (error.code === "P2025") {
      return {
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: "NOT_FOUND",
        message: "That record no longer exists.",
      };
    }
    if (error.code === "P2003") {
      return {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        code: "BAD_REQUEST",
        message: "A related record does not exist.",
      };
    }
    if (UNAVAILABLE.has(error.code)) {
      return {
        statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
        code: "DATABASE_ERROR",
        message: "The database is temporarily unavailable. Try again shortly.",
      };
    }
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
      code: "DATABASE_ERROR",
      message: "The database is temporarily unavailable. Try again shortly.",
    };
  }
  return {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: "DATABASE_ERROR",
    message: "A database error occurred while processing your request.",
  };
}
