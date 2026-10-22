import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { activePalette } from "@/lib/brand-colors";

// Every saved colour system in src/styles/color-systems must be safe to apply:
// the same token set in both themes, and WCAG AA for every text pair.

interface Palette {
  name: string;
  shared: Record<string, string>;
  dark: Record<string, string>;
  light: Record<string, string>;
  raw: { buttonFrom: string; buttonTo: string };
}

type Rgba = [number, number, number, number];

const dir = path.resolve(import.meta.dirname, "../../src/styles/color-systems");
const palettes = readdirSync(dir)
  .filter((file) => file.endsWith(".json"))
  .map(
    (file) => JSON.parse(readFileSync(path.join(dir, file), "utf8")) as Palette,
  );

function parse(color: string): Rgba {
  if (color.startsWith("#")) {
    const [r, g, b] = [1, 3, 5].map((i) =>
      Number.parseInt(color.slice(i, i + 2), 16),
    );
    return [r ?? 0, g ?? 0, b ?? 0, 1];
  }
  const match = /^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)$/.exec(color);
  if (!match) throw new Error(`Unparseable colour: ${color}`);
  return [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    match[4] === undefined ? 1 : Number(match[4]),
  ];
}

function luminance([r, g, b]: Rgba) {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast of `fg` (alpha-composited over `bg`) against `bg`. */
function contrast(fg: string, bg: string) {
  const back = parse(bg);
  const front = parse(fg);
  const alpha = front[3];
  const mixed: Rgba = [
    front[0] * alpha + back[0] * (1 - alpha),
    front[1] * alpha + back[1] * (1 - alpha),
    front[2] * alpha + back[2] * (1 - alpha),
    1,
  ];
  const [hi, lo] = [luminance(mixed), luminance(back)].sort((a, b) => b - a);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

const TEXT_TOKENS = [
  "--foreground",
  "--muted-foreground",
  "--primary-strong",
  "--secondary-strong",
  "--accent-strong",
  "--success",
  "--error",
];

it("finds the saved palettes", () => {
  expect(palettes.length).toBeGreaterThanOrEqual(5);
});

it("applies the active palette's tokens in globals.css", () => {
  const css = readFileSync(
    path.resolve(import.meta.dirname, "../../src/app/globals.css"),
    "utf8",
  );
  const block = (start: string) => {
    const from = css.indexOf(start);
    return css
      .slice(from, css.indexOf("\n}\n", from))
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\( /g, "(")
      .replace(/ \)/g, ")");
  };
  const active = palettes.find((p) => p.name === activePalette);
  expect(
    active,
    `src/styles/color-systems/${activePalette}.json`,
  ).toBeDefined();
  if (!active) return;
  const dark = block(":root,\n.dark {");
  const light = block(".light {");
  for (const [token, value] of Object.entries({
    ...active.dark,
    ...active.shared,
  })) {
    expect(dark).toContain(`${token}: ${value};`);
  }
  for (const [token, value] of Object.entries(active.light)) {
    expect(light).toContain(`${token}: ${value};`);
  }
});

describe.each(palettes)("$name", (palette) => {
  it("defines the same tokens in dark and light", () => {
    expect(Object.keys(palette.light).sort()).toEqual(
      Object.keys(palette.dark).sort(),
    );
  });

  it("keeps white text ≥ 4.5:1 on both button stops", () => {
    for (const stop of [palette.raw.buttonFrom, palette.raw.buttonTo]) {
      expect(contrast("#ffffff", stop)).toBeGreaterThanOrEqual(4.5);
    }
    for (const theme of [palette.dark, palette.light]) {
      expect(theme["--gradient-button"]).toContain(palette.raw.buttonFrom);
      expect(theme["--gradient-button"]).toContain(palette.raw.buttonTo);
    }
  });

  it.each(["dark", "light"] as const)(
    "keeps %s text tokens ≥ 4.5:1 on the background",
    (name) => {
      const theme = palette[name];
      const background = theme["--background"] ?? "";
      for (const token of TEXT_TOKENS) {
        const ratio = contrast(theme[token] ?? "", background);
        expect(ratio, `${token} = ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(
          4.5,
        );
      }
      // --primary is for fills, borders, and icons: non-text needs 3:1.
      expect(
        contrast(theme["--primary"] ?? "", background),
      ).toBeGreaterThanOrEqual(3);
    },
  );
});
