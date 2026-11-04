import { describe, expect, it } from "vitest";
import { initials } from "@/components/ui/avatar";
import { safeAdminPath } from "@/lib/auth/safe-path";
import {
  SESSION_ABSOLUTE_MS,
  SESSION_IDLE_MS,
  SESSION_TOUCH_MS,
  judgeSession,
  needsTouch,
} from "@/lib/auth/session-policy";
import { describeUserAgent, formatRelative } from "@/lib/format";
import { withParams } from "@/lib/url-state";

describe("safeAdminPath", () => {
  it.each([
    "/admin",
    "/admin/users",
    "/admin/users?q=a&page=2",
    "/admin/users/abc#top",
  ])("allows %s", (p) => {
    expect(safeAdminPath(p)).toBe(p);
  });

  it.each([
    "//evil.com",
    "https://evil.com",
    "/\\evil.com",
    "/admin//evil.com",
    "/administrator",
    "/admin/sign-in",
    "/dashboard",
    "javascript:alert(1)",
    "/admin\r\nSet-Cookie: x=1",
    undefined,
    42,
  ])("falls back to the dashboard for %s", (p) => {
    expect(safeAdminPath(p)).toBe("/admin");
  });
});

describe("session policy", () => {
  const now = new Date("2026-01-01T12:00:00Z");
  const row = (over: Partial<Parameters<typeof judgeSession>[0]> = {}) => ({
    expiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS),
    lastSeenAt: new Date(now.getTime() - 1000),
    revokedAt: null,
    ...over,
  });

  it("accepts a fresh session", () => {
    expect(judgeSession(row(), now)).toBe("valid");
  });

  it("rejects revoked, expired and idle sessions", () => {
    expect(judgeSession(row({ revokedAt: now }), now)).toBe("revoked");
    expect(
      judgeSession(row({ expiresAt: new Date(now.getTime() - 1) }), now),
    ).toBe("expired");
    expect(
      judgeSession(
        row({ lastSeenAt: new Date(now.getTime() - SESSION_IDLE_MS - 1) }),
        now,
      ),
    ).toBe("idle");
  });

  it("revoked wins over everything else", () => {
    expect(
      judgeSession(row({ revokedAt: now, expiresAt: new Date(0) }), now),
    ).toBe("revoked");
  });

  it("throttles lastSeenAt writes", () => {
    expect(
      needsTouch(row({ lastSeenAt: new Date(now.getTime() - 1000) }), now),
    ).toBe(false);
    expect(
      needsTouch(
        row({ lastSeenAt: new Date(now.getTime() - SESSION_TOUCH_MS - 1) }),
        now,
      ),
    ).toBe(true);
  });
});

describe("withParams", () => {
  it("keeps the query and applies the patch", () => {
    expect(
      withParams(
        "/admin/users",
        { q: "jo", status: "ACTIVE" },
        { sort: "email", dir: "asc" },
      ),
    ).toBe("/admin/users?q=jo&status=ACTIVE&sort=email&dir=asc");
  });

  it("resets the page unless the patch sets it", () => {
    expect(withParams("/p", { page: "4", q: "a" }, { q: "b" })).toBe("/p?q=b");
    expect(withParams("/p", { page: "4" }, { page: 5 })).toBe("/p?page=5");
  });

  it("removes keys given undefined or an empty string", () => {
    expect(
      withParams("/p", { q: "a", status: "X" }, { q: "", status: undefined }),
    ).toBe("/p");
  });

  it("uses the first value of repeated params", () => {
    expect(withParams("/p", { q: ["a", "b"] }, { sort: "x" })).toBe(
      "/p?q=a&sort=x",
    );
  });
});

describe("initials", () => {
  it("uses first and last word", () => {
    expect(initials("Jane Q Tester", "j@x.co")).toBe("JT");
    expect(initials("jane", "j@x.co")).toBe("JA");
  });

  it("falls back to the email", () => {
    expect(initials(null, "zed@x.co")).toBe("Z");
  });
});

describe("format helpers", () => {
  it("describes browsers coarsely", () => {
    expect(
      describeUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
      ),
    ).toBe("Chrome on macOS");
    expect(describeUserAgent(null)).toBe("Unknown device");
  });

  it("formats relative times", () => {
    const now = Date.parse("2026-06-10T12:00:00Z");
    expect(formatRelative("2026-06-10T11:59:50Z", now)).toBe("just now");
    expect(formatRelative("2026-06-10T11:00:00Z", now)).toBe("1 hour ago");
    expect(formatRelative("2026-06-09T12:00:00Z", now)).toBe("yesterday");
    expect(formatRelative("2025-01-01T00:00:00Z", now)).toMatch(/UTC$/);
  });
});
