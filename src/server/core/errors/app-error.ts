import { HTTP_STATUS, type ErrorCode } from "./codes";
import type { FieldErrors } from "@/lib/action-result";

/**
 * The one error class for expected failures (the Express starter's AppError).
 * Its message is safe to show to the user. Anything else that is thrown is
 * logged with a request id and shown as a generic error (see normalize.ts).
 */
export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly code: ErrorCode,
    readonly fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message: string, fieldErrors?: FieldErrors) {
    return new AppError(
      HTTP_STATUS.BAD_REQUEST,
      message,
      "BAD_REQUEST",
      fieldErrors,
    );
  }

  static validation(message: string, fieldErrors: FieldErrors) {
    return new AppError(
      HTTP_STATUS.BAD_REQUEST,
      message,
      "VALIDATION_ERROR",
      fieldErrors,
    );
  }

  static unauthorized(message = "Your session has ended. Sign in again.") {
    return new AppError(HTTP_STATUS.UNAUTHORIZED, message, "UNAUTHORIZED");
  }

  static forbidden(message = "You can't do that.") {
    return new AppError(HTTP_STATUS.FORBIDDEN, message, "FORBIDDEN");
  }

  static notFound(message = "That record no longer exists.") {
    return new AppError(HTTP_STATUS.NOT_FOUND, message, "NOT_FOUND");
  }

  static conflict(message: string, fieldErrors?: FieldErrors) {
    return new AppError(HTTP_STATUS.CONFLICT, message, "CONFLICT", fieldErrors);
  }

  static rateLimited(message: string) {
    return new AppError(HTTP_STATUS.TOO_MANY_REQUESTS, message, "RATE_LIMITED");
  }
}
