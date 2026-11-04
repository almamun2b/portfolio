import "server-only";
import { after } from "next/server";
import { logger } from "@/server/core/logger";

/**
 * Runs non-critical work after the response is sent (`after()`), so it never
 * delays the user. Outside a request scope (scripts, tests) `after` throws,
 * and the work runs inline instead. Failures are logged, never thrown.
 */
export function defer(name: string, work: () => Promise<unknown>): void {
  const run = () =>
    work().catch((error: unknown) => {
      logger.error("defer.failed", error, { name });
    });
  try {
    after(run);
  } catch {
    void run();
  }
}
