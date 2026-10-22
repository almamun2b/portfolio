import active from "@/styles/color-systems/violet-indigo.json";

/**
 * Plain colour values of the active palette, for places that can't read CSS
 * variables: next/og images, the manifest, the theme-color meta, and the
 * constellation fallbacks. Keep the import above on the same palette whose
 * tokens are in globals.css (see src/styles/color-systems/README.md).
 */
export const brand = active.raw;

/** The active palette's file name, so tests can match globals.css to it. */
export const activePalette = active.name;

/** `rgba()` from one of the palette's "r,g,b" triples. */
export function rgba(rgb: string, alpha: number) {
  return `rgba(${rgb},${alpha})`;
}
