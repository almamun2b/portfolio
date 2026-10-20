const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseMonth(value: string): { year: number; month: number } {
  const [year = "0", month = "1"] = value.split("-");
  return { year: Number(year), month: Number(month) };
}

/** "2026-07" → "Jul 2026" */
export function formatMonth(value: string): string {
  const { year, month } = parseMonth(value);
  return `${MONTHS[month - 1] ?? ""} ${String(year)}`.trim();
}

/** Whole years from a "YYYY-MM" start until now (floored). */
export function yearsSince(start: string, now = new Date()): number {
  const { year, month } = parseMonth(start);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(0, Math.floor(months / 12));
}

/** "Mar 2022 – Feb 2026 · 4 yrs" style range with an inclusive duration. */
export function formatRange(start: string, end?: string, now = new Date()) {
  const a = parseMonth(start);
  const b = end
    ? parseMonth(end)
    : { year: now.getFullYear(), month: now.getMonth() + 1 };
  const months = (b.year - a.year) * 12 + (b.month - a.month) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [
    years > 0 ? `${String(years)} yr${years > 1 ? "s" : ""}` : "",
    rest > 0 ? `${String(rest)} mo` : "",
  ].filter(Boolean);
  return {
    label: `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`,
    duration: parts.join(" "),
    dateTime: end ? `${start}/${end}` : start,
  };
}
