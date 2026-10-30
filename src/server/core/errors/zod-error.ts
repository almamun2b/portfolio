import type { ZodError } from "zod";
import { HTTP_STATUS } from "./codes";
import type { FieldErrors } from "@/lib/action-result";
import type { Normalized } from "./normalize";

export function toFieldErrors(error: ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export function handleZodError(error: ZodError): Normalized {
  return {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    code: "VALIDATION_ERROR",
    message: "Check the highlighted fields.",
    fieldErrors: toFieldErrors(error),
  };
}
