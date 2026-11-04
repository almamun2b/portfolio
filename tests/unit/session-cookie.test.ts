import { describe, expect, it } from "vitest";
import {
  SESSION_COOKIE_BASE,
  SESSION_COOKIE_PATTERN,
  sessionCookieName,
} from "@/lib/auth/session-policy";

describe("session cookie name", () => {
  it("is prefixed with __Secure- only over https", () => {
    expect(sessionCookieName(false)).toBe(SESSION_COOKIE_BASE);
    expect(sessionCookieName(true)).toBe(`__Secure-${SESSION_COOKIE_BASE}`);
  });

  it("is not the Auth.js default, so other localhost apps can't collide with it", () => {
    expect(SESSION_COOKIE_BASE).not.toContain("authjs");
  });
});

describe("SESSION_COOKIE_PATTERN (what proxy.ts looks for)", () => {
  it.each([
    "portfolio-admin.session-token",
    "__Secure-portfolio-admin.session-token",
    "portfolio-admin.session-token.0",
    "__Secure-portfolio-admin.session-token.12",
  ])("accepts %s", (name) => {
    expect(SESSION_COOKIE_PATTERN.test(name)).toBe(true);
  });

  it.each([
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "portfolio-admin.session-tokenX",
    "xportfolio-admin.session-token",
    "portfolio-admin_session-token",
    "portfolio-admin.session-token.",
  ])("rejects %s", (name) => {
    expect(SESSION_COOKIE_PATTERN.test(name)).toBe(false);
  });
});
