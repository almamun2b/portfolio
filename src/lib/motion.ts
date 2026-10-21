/**
 * Whether decorative motion may run: the visitor hasn't asked for reduced
 * motion and hasn't paused animations with the site's own control.
 * Client-only (reads `matchMedia` and the `<html>` dataset).
 */
export function motionAllowed() {
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    document.documentElement.dataset.motion !== "paused"
  );
}
