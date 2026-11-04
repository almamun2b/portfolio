import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { PaginationMeta } from "@/lib/dto";
import type { NormalizedWithId } from "@/server/core/errors/normalize";

// The response envelope of the Express starter, so API clients (and a future
// mobile app) see the same shapes from both backends.

interface Envelope {
  path: string;
  timestamp: string;
}

export interface SuccessBody<T> extends Envelope {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ErrorBody extends Envelope {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  errors: { field: string; message: string }[];
  requestId: string;
}

// Responses depend on the session cookie: never share them between users.
const HEADERS = { "Cache-Control": "private, no-store" } as const;

const envelope = (req: NextRequest): Envelope => ({
  path: req.nextUrl.pathname,
  timestamp: new Date().toISOString(),
});

export function ok<T>(
  req: NextRequest,
  data: T,
  options: { status?: number; message?: string; meta?: PaginationMeta } = {},
): NextResponse<SuccessBody<T>> {
  const statusCode = options.status ?? 200;
  const body: SuccessBody<T> = {
    success: true,
    statusCode,
    message: options.message ?? "OK",
    data,
    ...(options.meta ? { meta: options.meta } : {}),
    ...envelope(req),
  };
  return NextResponse.json(body, { status: statusCode, headers: HEADERS });
}

export function fail(
  req: NextRequest,
  failure: NormalizedWithId,
): NextResponse<ErrorBody> {
  const errors = Object.entries(failure.fieldErrors ?? {}).flatMap(
    ([field, messages]) => messages.map((message) => ({ field, message })),
  );
  const body: ErrorBody = {
    success: false,
    statusCode: failure.statusCode,
    code: failure.code,
    message: failure.message,
    errors,
    requestId: failure.requestId,
    ...envelope(req),
  };
  return NextResponse.json(body, {
    status: failure.statusCode,
    headers: HEADERS,
  });
}
