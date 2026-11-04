import "server-only";
import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";
import type { FieldErrors } from "@/lib/action-result";
import { logger } from "@/server/core/logger";
import { AppError } from "./app-error";
import { HTTP_STATUS, type ErrorCode } from "./codes";
import { handlePrismaError, isPrismaError } from "./prisma-error";
import { handleZodError } from "./zod-error";

export interface Normalized {
  statusCode: number;
  code: ErrorCode;
  message: string;
  fieldErrors?: FieldErrors | undefined;
}

export interface NormalizedWithId extends Normalized {
  requestId: string;
}

/**
 * The global error handler (the Express starter's globalErrorHandler). Every
 * Server Action and Route Handler funnels its catch block through here, so an
 * error looks the same whichever door it came through:
 *
 *  - redirect() / notFound() keep flowing (unstable_rethrow);
 *  - AppError, Zod and Prisma errors become their mapped status and message;
 *  - anything else is logged with the request id and shown as a generic
 *    message, so internals never reach the browser.
 */
export function normalizeError(
  error: unknown,
  context: { requestId: string; name: string },
): NormalizedWithId {
  unstable_rethrow(error);
  const { requestId, name } = context;

  let result: Normalized;
  if (error instanceof AppError) {
    result = {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  } else if (error instanceof ZodError) {
    result = handleZodError(error);
  } else if (isPrismaError(error)) {
    result = handlePrismaError(error);
  } else {
    result = {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: "INTERNAL_ERROR",
      message: `Something went wrong. Try again, and quote reference ${requestId} if it keeps happening.`,
    };
  }

  if (result.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error("request.failed", error, {
      name,
      requestId,
      code: result.code,
    });
  } else {
    logger.warn("request.rejected", {
      name,
      requestId,
      code: result.code,
      status: result.statusCode,
    });
  }
  return { ...result, requestId };
}
