import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";

describe("serializeJsonLd", () => {
  it("escapes < so the JSON can't close its <script>", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual({
      name: "</script><script>alert(1)</script>",
    });
  });

  it("builds a positioned breadcrumb list", () => {
    const list = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ]);
    expect(list.itemListElement).toMatchObject([
      { position: 1 },
      { position: 2 },
    ]);
  });
});
