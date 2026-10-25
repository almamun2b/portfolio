import "server-only";
import type { FieldErrors } from "@/lib/action-result";

export type DomainErrorCode =
  "UNAUTHORIZED" | "NOT_FOUND" | "CONFLICT" | "RATE_LIMITED" | "INVALID";

/**
 * An expected failure whose message is safe to show to the user. Anything
 * else thrown is logged with a request id and shown as a generic error.
 */
export class DomainError extends Error {
  constructor(
    readonly code: DomainErrorCode,
    message: string,
    readonly fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.name = "DomainError";
  }
}
