import "server-only";
import { randomUUID } from "node:crypto";

type Level = "info" | "warn" | "error";

const SECRET_KEY = /pass(word)?|token|secret|hash|cookie|authorization/i;

function redact(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  return Object.fromEntries(
    Object.entries(value).map(([key, v]) => [
      key,
      SECRET_KEY.test(key) ? "[redacted]" : redact(v, depth + 1),
    ]),
  );
}

function errorFields(error: unknown) {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    };
  }
  return { errorMessage: String(error) };
}

function write(level: Level, message: string, fields: Record<string, unknown>) {
  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    message,
    ...(redact(fields) as Record<string, unknown>),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** Structured JSON logs. Secret-looking keys are redacted before printing. */
export const logger = {
  info: (message: string, fields: Record<string, unknown> = {}) => {
    write("info", message, fields);
  },
  warn: (message: string, fields: Record<string, unknown> = {}) => {
    write("warn", message, fields);
  },
  error: (
    message: string,
    error: unknown,
    fields: Record<string, unknown> = {},
  ) => {
    write("error", message, { ...fields, ...errorFields(error) });
  },
};

/** Short id shown to the user and logged, so a report can be traced. */
export function newRequestId(): string {
  return randomUUID().slice(0, 8);
}
