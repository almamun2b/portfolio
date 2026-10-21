import { describe, expect, it } from "vitest";
import { formatMonth, formatRange, yearsSince } from "@/lib/dates";

describe("formatMonth", () => {
  it("formats YYYY-MM as a short month and year", () => {
    expect(formatMonth("2026-07")).toBe("Jul 2026");
    expect(formatMonth("2022-12")).toBe("Dec 2022");
  });
});

describe("yearsSince", () => {
  it("floors whole years", () => {
    const now = new Date(2026, 9, 21); // Oct 2026
    expect(yearsSince("2022-03", now)).toBe(4);
    expect(yearsSince("2022-11", now)).toBe(3);
  });

  it("never goes negative", () => {
    expect(yearsSince("2030-01", new Date(2026, 0, 1))).toBe(0);
  });
});

describe("formatRange", () => {
  it("counts the end month inclusively", () => {
    const range = formatRange("2022-03", "2026-02");
    expect(range.label).toBe("Mar 2022 – Feb 2026");
    expect(range.duration).toBe("4 yrs");
    expect(range.dateTime).toBe("2022-03/2026-02");
  });

  it("runs to now for a current role", () => {
    const range = formatRange("2026-07", undefined, new Date(2026, 9, 21));
    expect(range.label).toBe("Jul 2026 – Present");
    expect(range.duration).toBe("4 mo");
    expect(range.dateTime).toBe("2026-07");
  });
});
