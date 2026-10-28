import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CACHE_TAGS } from "@/server/core/cache";
import { accountTags } from "@/server/modules/account/account.constants";
import { sessionTags } from "@/server/modules/sessions/sessions.constants";
import { userTags } from "@/server/modules/users/users.constants";

const modules = path.resolve(import.meta.dirname, "../../src/server/modules");

describe("mutation tag maps", () => {
  it("creating a user refreshes the list, the stats, and the audit trail", () => {
    expect(userTags.create()).toEqual([
      CACHE_TAGS.USERS,
      CACHE_TAGS.DASHBOARD,
      CACHE_TAGS.AUDIT,
    ]);
  });

  it("editing a user refreshes that user too, but not the stats", () => {
    const tags = userTags.update({ id: "u1" });
    expect(tags).toContain(CACHE_TAGS.user("u1"));
    expect(tags).toContain(CACHE_TAGS.USERS);
    expect(tags).not.toContain(CACHE_TAGS.DASHBOARD);
  });

  it.each(["setStatus", "remove", "setPassword"] as const)(
    "%s also ends the user's sessions and updates the stats",
    (name) => {
      const tags = userTags[name]({ id: "u1" });
      expect(tags).toEqual(
        expect.arrayContaining([
          CACHE_TAGS.USERS,
          CACHE_TAGS.user("u1"),
          CACHE_TAGS.sessions("u1"),
          CACHE_TAGS.DASHBOARD,
          CACHE_TAGS.AUDIT,
        ]),
      );
    },
  );

  it("revoking a session targets the owner reported by the service", () => {
    const tags = sessionTags.revoke({ sessionId: "s1" }, { userId: "u9" });
    expect(tags).toContain(CACHE_TAGS.sessions("u9"));
  });

  it("changing your own password refreshes your user and sessions", () => {
    expect(accountTags.changePassword({}, { userId: "me" })).toEqual(
      expect.arrayContaining([
        CACHE_TAGS.user("me"),
        CACHE_TAGS.sessions("me"),
      ]),
    );
  });

  it("every mutation declares a tag set where it is wired", () => {
    // A new action or route that forgets `tags` would serve stale lists.
    const wiring = readdirSync(modules, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.(actions|controller)\.ts$/.test(file))
      .map((file) => ({
        file,
        source: readFileSync(path.join(modules, file), "utf8"),
      }));
    for (const { file, source } of wiring) {
      const mutations = [
        ...source.matchAll(
          /adminAction\(|apiRoute\(\s*\{[^}]*?(?:body|name: "[a-z]+\.(?:create|update|set|delete|revoke|change)\w*")/gs,
        ),
      ];
      const declared = source.match(/tags:/g) ?? [];
      expect(declared.length, file).toBeGreaterThanOrEqual(mutations.length);
    }
  });
});
