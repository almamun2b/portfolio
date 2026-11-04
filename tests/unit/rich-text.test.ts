import { describe, expect, it } from "vitest";
import {
  htmlToText,
  readingMinutes,
  sanitizePostHtml,
} from "@/server/core/rich-text";

describe("sanitizePostHtml", () => {
  it("keeps what the editor can produce", () => {
    const html =
      '<h2>Title</h2><p>Some <strong>bold</strong>, <em>italic</em> and <code>code</code>.</p><ul><li>one</li></ul><blockquote>quote</blockquote><pre><code class="language-ts">const a = 1;</code></pre><hr>';
    const out = sanitizePostHtml(html);
    expect(out).toContain("<h2>Title</h2>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<ul><li>one</li></ul>");
    expect(out).toContain('<code class="language-ts">');
    expect(out).toContain("<hr />");
  });

  it("removes scripts, handlers, iframes, and styles", () => {
    const out = sanitizePostHtml(
      '<p onclick="x()">hi</p><script>alert(1)</script><iframe src="https://evil.test"></iframe><img src="https://a.test/x.png" onerror="alert(1)" style="x:y">',
    );
    expect(out).not.toMatch(/script|iframe|onclick|onerror|style/i);
    expect(out).toContain("<p>hi</p>");
    expect(out).toContain('<img src="https://a.test/x.png" />');
  });

  it("drops javascript: and data: URLs", () => {
    const out = sanitizePostHtml(
      '<a href="javascript:alert(1)">x</a><a href="data:text/html;base64,AAAA">y</a><img src="data:image/png;base64,AAAA"><img src="http://insecure.test/a.png">',
    );
    expect(out).not.toMatch(/javascript:|data:|http:\/\/insecure/);
  });

  it("opens external links safely", () => {
    const out = sanitizePostHtml('<a href="https://example.com">x</a>');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it("is stable: sanitizing twice changes nothing", () => {
    const once = sanitizePostHtml(
      '<p>a <a href="https://example.com">b</a></p><img src="https://a.test/x.png" alt="x">',
    );
    expect(sanitizePostHtml(once)).toBe(once);
  });
});

describe("htmlToText and readingMinutes", () => {
  it("returns plain, decoded, single-spaced text", () => {
    expect(htmlToText("<p>Tom &amp; Jerry</p><p>say  <b>hi</b></p>")).toBe(
      "Tom & Jerry say hi",
    );
  });

  it("never reports less than a minute", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("a few words")).toBe(1);
    expect(readingMinutes(Array(660).fill("word").join(" "))).toBe(3);
  });
});
