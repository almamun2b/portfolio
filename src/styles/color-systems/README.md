# Colour systems

Every colour system the site can wear, saved as data. Each JSON file holds the **complete** token set for both themes, exactly as it goes into `src/app/globals.css`, so any of them can be applied or loaded later (for example from a future admin dashboard) without redesigning anything.

**Active palette: Violet → Indigo** (`violet-indigo.json`), confirmed by the owner on 2026-10-23.

| File                  | Palette          | Button gradient       | Feel                                                    |
| --------------------- | ---------------- | --------------------- | ------------------------------------------------------- |
| `indigo-blue.json`    | Indigo → Blue    | `#4f46e5` → `#2563eb` | Linear/Stripe-style: calm, technical (tried first)      |
| `emerald-cyan.json`   | Emerald → Cyan   | `#047857` → `#0e7490` | The original identity, saved verbatim before the trial  |
| `blue-sky.json`       | Blue → Sky       | `#1d4ed8` → `#0369a1` | Conservative, enterprise (tried)                        |
| `violet-indigo.json`  | Violet → Indigo  | `#7c3aed` → `#4f46e5` | **Active.** Expressive, product-studio                  |
| `amber-orange.json`   | Amber → Orange   | `#c2410c` → `#b45309` | Warm, energetic, distinctive                            |
| `teal-cyan.json`      | Teal → Cyan      | `#0f766e` → `#0e7490` | Fresh, calm; a tidier cousin of the original            |
| `cyan-indigo.json`    | Cyan → Indigo    | `#0e7490` → `#4338ca` | Cool, high-tech, SaaS dashboard                         |
| `fuchsia-violet.json` | Fuchsia → Violet | `#a21caf` → `#6d28d9` | Bold, creative, stands out most                         |
| `graphite-slate.json` | Graphite → Slate | `#475569` → `#334155` | Near-monochrome, editorial: the work carries the colour |

## File shape

```jsonc
{
  "name": "indigo-blue", // file name, also `activePalette` in src/lib/brand-colors.ts
  "label": "Indigo → Blue",
  "description": "…",
  "shared": { "--traffic-red": "…", "--backdrop": "…" }, // theme-independent, goes in :root,.dark
  "dark": { "color-scheme": "dark", "--background": "…", "…": "…" }, // the :root,.dark block
  "light": { "color-scheme": "light", "--background": "…", "…": "…" }, // the .light block
  "raw": {
    "themeColor": "…",
    "buttonFrom": "…",
    "primaryRgb": "r,g,b",
    "…": "…",
  }, // for code that can't read CSS vars
}
```

`dark` and `light` always carry the same token names, in the same roles (see DESIGN.md › Colors). Every palette keeps the same rules: two hues, two-stop gradients that start on the primary, white text only on the deep `--gradient-button` stops, and success/error that never change with the brand.

## Guardrails

`tests/unit/palettes.test.ts` runs on every `pnpm test` and checks **every** file here:

- dark and light define identical token sets;
- white text holds ≥ 4.5:1 on both button stops;
- `--foreground`, `--muted-foreground`, `--primary-strong`, `--secondary-strong`, `--accent-strong`, `--success`, and `--error` hold ≥ 4.5:1 on `--background` in both themes, and `--primary` holds ≥ 3:1 (non-text);
- the active palette's values are exactly what `globals.css` contains.

A new palette that fails contrast can't land silently.

## Applying a palette (by hand, until the dashboard exists)

1. Copy the `dark` + `shared` values into the `:root, .dark` block of `src/app/globals.css`, and the `light` values into the `.light` block (keep the comments and grouping).
2. Point the import in `src/lib/brand-colors.ts` at the new JSON file (OG images, manifest, `themeColor`, and constellation fallbacks follow it).
3. Update the button stops in `src/app/icon.svg`, then re-render `src/app/apple-icon.png`, `src/app/favicon.ico`, and `public/icons/*.png` from it.
4. Update the "Active palette" line above and DESIGN.md's frontmatter colours and prose values.
5. Run `pnpm test`: the palette test fails until steps 1 and 2 agree.
