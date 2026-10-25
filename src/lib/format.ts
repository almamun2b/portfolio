// Date and user-agent helpers for admin screens. Fixed locale and UTC, so
// the server render is deterministic (no hydration drift, no timezone guess).

const dateTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export const formatDateTime = (iso: string): string =>
  `${dateTime.format(new Date(iso))} UTC`;

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "5 minutes ago", "yesterday"; older than 30 days falls back to the date. */
export function formatRelative(iso: string, now = Date.now()): string {
  const diff = new Date(iso).getTime() - now;
  if (Math.abs(diff) > 30 * 86_400_000) return formatDateTime(iso);
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) >= size)
      return relative.format(Math.round(diff / size), unit);
  }
  return "just now";
}

/** "Chrome on macOS" from a user-agent string; deliberately coarse. */
export function describeUserAgent(ua: string | null): string {
  if (!ua) return "Unknown device";
  const browser = ua.includes("Edg/")
    ? "Edge"
    : ua.includes("OPR/")
      ? "Opera"
      : ua.includes("Firefox/")
        ? "Firefox"
        : ua.includes("Chrome/")
          ? "Chrome"
          : ua.includes("Safari/")
            ? "Safari"
            : "Browser";
  const os = ua.includes("Windows")
    ? "Windows"
    : ua.includes("Android")
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : ua.includes("Mac OS X")
          ? "macOS"
          : ua.includes("Linux")
            ? "Linux"
            : "unknown OS";
  return `${browser} on ${os}`;
}
