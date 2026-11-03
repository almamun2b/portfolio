import { z } from "zod";
import { PROJECT_CONTEXTS, PROJECT_CONTRIBUTIONS } from "@/lib/content-labels";
import { coverArtSchema, type CoverArt } from "@/lib/schemas/content";

// Database rows keep `context`, `contribution` and `coverArt` as plain
// strings (no enum migrations). Public pages need the narrow types, so they
// are validated here once, and an unknown value fails the build.

export const contentContextSchema = z.object({
  context: z.enum(PROJECT_CONTEXTS),
  contribution: z.enum(PROJECT_CONTRIBUTIONS),
});

export function toCoverArt(value: string): CoverArt {
  return coverArtSchema.parse(value);
}
