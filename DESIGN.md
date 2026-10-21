---
name: Md Abdul Mamun — Portfolio
description: An emerald/cyan night console for a full-stack engineer; dark by default, glass panels, pill controls, two colours and two-stop gradients only.
colors:
  night-ground: "#05090b"
  mint-text: "#ecfdf5"
  night-card-solid: "#0a1215"
  night-popover: "#0b1517"
  signal-emerald: "#10b981"
  emerald-strong: "#34d399"
  signal-cyan: "#22d3ee"
  cyan-strong: "#67e8f9"
  muted-mint: "rgb(236 253 245 / 0.64)"
  emerald-wash: "rgb(16 185 129 / 0.08)"
  glass-card: "rgb(255 255 255 / 0.035)"
  hairline-emerald: "rgb(16 185 129 / 0.14)"
  hairline-emerald-strong: "rgb(16 185 129 / 0.3)"
  hairline-emerald-glow: "rgb(16 185 129 / 0.55)"
  input-stroke: "rgb(52 211 153 / 0.55)"
  error-rose: "#fb7185"
  button-stop-emerald: "#047857"
  button-stop-cyan: "#0e7490"
  day-ground: "#f4fbf8"
  day-ink: "#0b1f1a"
  day-emerald: "#047857"
  day-emerald-strong: "#065f46"
  day-teal: "#14b8a6"
  day-cyan-strong: "#0e7490"
  day-display-start: "#064e3b"
  day-muted-ink: "rgb(11 31 26 / 0.7)"
  day-error: "#be123c"
  whatsapp-green: "#25d366"
typography:
  display:
    fontFamily: "Space Grotesk, Inter, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Space Grotesk, Inter, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.25rem, 5.5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline-section:
    fontFamily: "Space Grotesk, Inter, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.85rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Space Grotesk, Inter, ui-sans-serif, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.02em"
  body-lead:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  4xl: "32px"
  full: "9999px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  card-pad: "24px"
  card-pad-wide: "28px"
  section-y: "80px"
  section-y-sm: "96px"
  section-y-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.button-stop-emerald}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.button-stop-emerald}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "0 28px"
    height: "52px"
  button-outline:
    backgroundColor: "{colors.glass-card}"
    textColor: "{colors.mint-text}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.emerald-wash}"
  button-ghost:
    textColor: "{colors.mint-text}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "44px"
  button-soft:
    backgroundColor: "{colors.emerald-wash}"
    textColor: "{colors.emerald-strong}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "44px"
  badge:
    backgroundColor: "{colors.emerald-wash}"
    textColor: "{colors.emerald-strong}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "24px"
  card-glass:
    backgroundColor: "{colors.glass-card}"
    textColor: "{colors.mint-text}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.card-pad}"
  input:
    backgroundColor: "{colors.glass-card}"
    textColor: "{colors.mint-text}"
    rounded: "{rounded.2xl}"
    padding: "0 16px"
    height: "48px"
  nav-link:
    textColor: "{colors.muted-mint}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  nav-link-active:
    backgroundColor: "{colors.emerald-wash}"
    textColor: "{colors.mint-text}"
  floating-action:
    backgroundColor: "{colors.button-stop-emerald}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    size: "56px"
  floating-action-whatsapp:
    backgroundColor: "{colors.whatsapp-green}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    size: "56px"
---

# Design System: Md Abdul Mamun — Portfolio

All tokens live in `src/app/globals.css` as semantic CSS variables. The frontmatter records the **dark (default) theme** values plus the light-theme values that differ in role. Use them via the semantic utilities (`bg-background`, `text-muted-foreground`, `border-border-strong`, `text-primary-strong`, `bg-gradient-button`, `glass`); never write raw hex in components.

## Overview

**Creative North Star: "The Emerald Night Console"**

The engineer stands at the centre of his own stack, under a cool near-black sky (#05090b) lit by two soft lights: emerald top-left, cyan bottom-right. Content sits on frosted glass panels edged with emerald hairlines; actions are pills; a Three.js constellation of emerald and cyan points drifts behind the page and leans toward the cursor. The palette is the owner's own emerald → cyan identity: two colours, two-stop gradients, nothing else. The layout and motion vocabulary (glass panels, pill controls, spring lifts, gradient last words) was inspired by a reference site; the colour is the owner's.

Dark is the default and the server-rendered theme: `:root, .dark` carry the night tokens, `.light` carries the day tokens (a pale mint ground with deep emerald and deep cyan). `next-themes` runs with `defaultTheme="dark"` and `enableSystem={false}`, so the OS preference is deliberately ignored; the day/night switch in the header is the only way in. Tailwind exposes `dark:` and `light:` custom variants; components are written for night first and use `light:` only where day genuinely differs.

Density is generous: wide sections, short copy, one strong action per block. Motion is inertial smooth scrolling, a spring lift on hover, a staggered rise on scroll, and a slow ambient drift, and all of it stops under reduced motion.

**Key Characteristics:**

- Cool near-black ground with two soft radial glows (`--page-glow`), emerald top-left (11%) and cyan bottom-right (7%), fixed to the viewport.
- Two colours only: emerald and cyan. Every gradient has exactly two stops.
- Glass panels: 3.5% white fill, 16px blur, emerald hairline borders, 24px corners.
- Pill-shaped everything that you press or read as a tag.
- Space Grotesk headings with the last words of a section title in the brand gradient.
- Real screenshots in a fixed frame, or designed, labelled cover illustrations; never stock imagery.

## Colors

An emerald-led two-colour palette: emerald carries action and identity, cyan carries orientation, secondary signal, and the far end of every gradient, on a cool near-black (night) or pale mint (day) ground.

### Primary

- **Signal Emerald** (`signal-emerald`, `--primary`): the identity colour. Glows, hairline tints, the scrollbar, caret, selection wash, the active slider thumbnail border, and the start of every decorative gradient. 7.9:1 on the night ground. In day it becomes **Day Emerald** (`day-emerald`, 5.2:1 on the day ground), which is also the day focus ring.
- **Emerald Strong** (`emerald-strong`, `--primary-strong`): emerald as _text_ — links, soft-button labels, badge text, the focus ring (`--ring`), and the success colour. 10.4:1 on night. Day: `day-emerald-strong`.

### Secondary

- **Signal Cyan** (`signal-cyan`, `--secondary` / `--secondary-strong` / `--accent`): location pins, path labels, status pills, the far end of the brand gradient, the second constellation colour. **Cyan Strong** (`cyan-strong`, `--accent-strong`) is the cyan text form on night and the end stop of the hero display gradient. In day the fill form is **Day Teal** (`day-teal`) and the text form deepens to **Deep Cyan** (`day-cyan-strong`), because bright cyan fails as text on a pale ground.

### Neutral

- **Night Ground** (`night-ground`): page canvas. Day: `day-ground`.
- **Mint Text** (`mint-text`): body and heading text, and the start stop of the night display gradient. Day: `day-ink`.
- **Muted Mint** (`muted-mint`, alpha 0.64): secondary copy, captions, inactive nav, the slider counter. Day: `day-muted-ink` (alpha 0.7). These alphas were raised deliberately for contrast; do not lower them.
- **Glass Card** (`glass-card`) on blur; **Night Card Solid** (`night-card-solid`) where blur is not wanted (also the slider stage behind screenshots); **Night Popover** (`night-popover`) for dialogs, the chat sheet, and widget tooltips.
- **Hairlines**: `hairline-emerald` (default border, applied globally), `hairline-emerald-strong` (outline buttons, badges, scrolled header, slider frame), `hairline-emerald-glow` (hover/focus-within on interactive cards).
- **Theme switch** (`--toggle-track`, `--toggle-thumb`, `--toggle-thumb-foreground`; utilities `bg-toggle-track`, `bg-toggle-thumb`): night track `#062a24` with a `#6ee7b7 → #34d399` thumb; day track `#ccfbf1 → #cffafe` with a `#5eead4 → #14b8a6` thumb.
- **Theme-independent surfaces** (defined once on `:root`): `traffic-red/yellow/green` (`#ff5f57`, `#febc2e`, `#28c840`) for window-chrome dots on mock-ups only; `surface-light` (`#f5f5f7`) behind detail screenshots, which are captured on white; `device` (`#1b1d2a`) for the device body in cover art.
- **Status**: success reuses `emerald-strong` (day `day-emerald`); error is `error-rose` (day `day-error`).

### Gradients (globals.css)

All four are two-stop, 135°.

- `--gradient-button` (`button-stop-emerald` → `button-stop-cyan`, the same in both themes): the fill for every filled control, the logo tile, the favicon, and the chatbot launcher. Both stops hold ≥5.3:1 with white.
- `--gradient-brand` (`signal-emerald` → `signal-cyan`; day uses the button stops): gradient text on section-title highlights, the hover bar under cards, the scrollbar thumb. Decorative only.
- `--gradient-display` (`mint-text` → `cyan-strong`; day `day-display-start` → `day-cyan-strong`): the hero name only.
- `--gradient-tile` (emerald 16% → cyan 8%): icon tiles.

### Named Rules

**The Two Colours Rule.** The palette is emerald and cyan, and every gradient has exactly two stops, emerald first. No third hue, no violet, purple, or pink, no three-stop gradients. Error rose is a status colour, not a brand colour.

**The Deep Stops Rule.** White text and white icons only ever sit on `--gradient-button` (#047857 → #0e7490). Never put white on `--gradient-brand`; its bright stops fail contrast.

**The Strong-For-Text Rule.** A hue used as text uses its `-strong` token (`text-primary-strong`, `text-secondary-strong`, `text-accent-strong`). The base tokens are for fills, glows, and borders.

**The Brand Exception Rule.** WhatsApp green (`whatsapp-green`) appears on the floating WhatsApp button and nowhere else. Third-party brand colours stay inside their own marks.

## Typography

**Display Font:** Space Grotesk (fallback Inter, ui-sans-serif)
**Body Font:** Inter (fallback ui-sans-serif, system-ui)
**Mono Font:** JetBrains Mono (fallback ui-monospace, SFMono-Regular, Consolas)

All three load through `next/font/google` as `--font-space-grotesk`, `--font-inter`, `--font-jetbrains-mono`, mapped to `font-display`, `font-sans`, `font-mono`.

**Character:** a geometric, slightly technical display face over a neutral, highly legible text face, with mono reserved for things that are literally code or data.

### Hierarchy

- **Display** (700, `clamp(2.6rem,6.4vw,4.75rem)`, 1.02): the hero name only, in `text-gradient-display`.
- **Headline** (700, `clamp(2.25rem,5.5vw,4rem)`, 1.05): the page `<h1>` on inner pages.
- **Section headline** (700, `clamp(1.85rem,4vw,3rem)`, 1.1): section `<h2>`; final words may carry `text-gradient`.
- **Title** (600, 1.125rem, 1.375): card and item titles.
- **Body lead** (400, 1.05rem, 1.625; hero pitch 1.75): section descriptions, max ~42rem (`max-w-2xl`).
- **Body** (400, 0.92rem, 1.625): card descriptions in `muted-mint`.
- **Label** (500, 0.875rem): nav links, form labels, buttons (600).
- **Mono** (400, 0.75–0.85rem): code windows, years, file names, data values, the slider's `n / N` counter.

Every `h1–h4` gets `font-display`, `text-balance`, and −0.02em tracking from the base layer; paragraphs get `text-wrap: pretty`; `<time>` and `<data>` get tabular figures.

### Named Rules

**The Mono Is Data Rule.** JetBrains Mono appears only on code, file paths, years, counters, and data values. Never on headings, buttons, or running prose.

**The Gradient Last Words Rule.** A section title may end in a `text-gradient` highlight (one phrase, at the end). The hero name uses `text-gradient-display`. No other text is gradient-filled. (Sanctioned detector exception in `.impeccable/config.json`; the utilities are defined once in globals.css.)

## Layout

- **Container:** centred, `max-w-7xl` (1280px), 1440px from 1600px viewports; gutters 16 / 24 / 32px at base / `sm` / `lg`.
- **Section rhythm:** `py-20 sm:py-24 lg:py-28` (80 / 96 / 112px) via `<Section>`.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) plus 1600px for the wide container. Two-column splits (hero, page heroes) begin at `lg`; below that everything stacks.
- **Header:** sticky, 70px tall; `scroll-padding-top: 6rem` and the Lenis anchor offset (−96px) keep anchors clear of it.
- **Splits:** asymmetric two-column splits such as `minmax(0,1.08fr) minmax(0,1fr)` for heroes.
- **Project grids:** the home "Selected work" and `/projects` grids are equal cards, `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`, gap 24px. No lead card; every project gets the same frame.
- **Floating stack:** bottom-right, 16px from the edges (respecting safe-area insets), 24px from `sm`; `z-40`, under dialogs.

**The Explicit Base Rule.** Every responsive grid declares `grid-cols-1` (or another explicit count) at the base, and every `fr` track is written `minmax(0,…fr)` so long words, code, or images can never force overflow. Check at 375px.

## Elevation & Depth

Depth comes from light, not from paper: tonal glass over a glowing ground, emerald hairlines, and emerald-tinted shadows that appear on interaction. Surfaces are flat at rest, except the floating actions, which float by definition.

### Shadow Vocabulary

- **Card** (`--shadow-card`: night `0 24px 64px rgb(0 0 0 / .5)`; day `0 12px 40px rgb(4 120 87 / .12)`): large floating panels such as dialogs and widget tooltips.
- **Lift** (`--shadow-lift`: night `0 20px 48px rgb(16 185 129 / .2)`; day `0 18px 44px rgb(4 120 87 / .18)`): hover state of cards, primary buttons, and the chatbot launcher.
- **Button** (`--shadow-button`: night `0 6px 24px rgb(16 185 129 / .35)`; day `0 6px 22px rgb(4 120 87 / .3)`): resting glow under filled buttons and the chatbot launcher.
- **Header scrolled** (`0 6px 40px rgb(16 185 129 / .14)`): applied by a scroll-driven animation after 80px.
- **Focus halo on inputs**: `0 0 0 4px` of `--primary` at 22%.

### Named Rules

**The Lift Rule.** Interactive surfaces rise on hover (buttons −2px, floating actions −4px, cards −6px) on the spring easing and gain `--shadow-lift`; they return on `:active`. Nothing else moves on hover.

## Shapes

Soft, rounded geometry throughout. Pills (`rounded-full`) for buttons, badges, status pills, nav, the theme switch, and the 56px floating actions; 24px (`rounded-3xl`) for cards, panels, and the screenshot slider frame; 16px (`rounded-2xl`) for inputs, inner tiles, and the lightbox stage; 12px for small tiles and slider thumbnails; 4px only for inline link focus. Borders are 1px emerald hairlines; the decorative `hairline` utility is a 1px gradient rule fading at both ends. The portrait is a circle inside a gradient ring. The logo is a 40–44px rounded tile (0.85rem) on `--gradient-button` with a white "M".

## Components

All primitives are hand-built in `src/components/ui/` on native platform features, by the owner's decision: **no shadcn, no Radix**. `Dialog` / `Sheet` / `Lightbox` use the modal `<dialog>` (browser focus trap, Esc, focus return; `html:has(dialog[open]:modal)` locks scroll). `Tabs` is a WAI-ARIA tablist with roving tabindex. `Accordion` is `<details>` with an `interpolate-size` height transition. Variants are declared with `cva`, classes merged with `cn`. Reuse these; do not add a second implementation.

### Buttons

Confident, luminous pills.

- **Shape:** full pill; heights 36 / 44 / 52px (`sm` / `md` / `lg`), icon buttons 36 / 44px square.
- **Primary:** `--gradient-button` fill, white semibold text, `--shadow-button`. Hover lifts 2px, swaps to `--shadow-lift`, and brightens through a 12% white overlay.
- **Outline:** glass fill with `hairline-emerald-strong` border; hover lifts and turns the border `--primary`.
- **Ghost / Soft / Link:** ghost is text on an emerald wash on hover; soft is emerald-strong text on the wash; link is underlined emerald-strong text.
- **Focus:** 2px `--ring` outline, 3px offset. `ButtonLink` shares the same variants so links and buttons cannot drift.

### Chips

- **Badge:** pill, 1px border, 24–28px tall. Default emerald-strong on emerald wash; `secondary` cyan; `success` emerald; `outline` muted; `solid` uses the button gradient.
- **Status pill:** larger pill with a pulsing dot (`animate-pulse-dot`) for availability.

### Cards / Containers

- **Corner Style:** 24px.
- **Background:** `glass` (default), `card-solid`, or transparent outline.
- **Border:** `hairline-emerald`; interactive cards go to `hairline-emerald-glow` on hover and focus-within.
- **Interactive signature:** a 3px `--gradient-brand` bar grows from the left along the bottom edge on hover/focus-within, with the 6px lift.
- **Internal Padding:** 24px, 28px from `sm`.

### Inputs / Fields

- **Style:** 48px tall, 16px corners, glass fill, `input-stroke` border (0.55 alpha so the boundary passes 3:1).
- **Hover / Focus:** border to `--primary` at 70% / 100%, plus a 4px emerald halo.
- **Error:** `error-rose` border and halo; errors linked with `aria-describedby` / `aria-invalid` through `fieldIds()`.

### Navigation

- **Header:** sticky glass bar (`--header` fill, 28px blur) that deepens to `--header-scrolled` with an emerald glow by CSS scroll-driven animation (no JS).
- **Desktop nav:** a glass pill holding 36px pill links; inactive links are muted, the active one gets an emerald wash, an inset 1.5px `--primary` ring, and a soft glow. Shown from `lg`.
- **Mobile:** a `<dialog>`-based sheet.
- **Theme switch:** a pill track with a sliding knob (emerald moon on night, teal sun on day) on the bounce easing.

### Floating actions

A bottom-right stack (`src/components/widgets/`), assistant above, WhatsApp below, 12px apart.

- **Chatbot launcher:** 56px pill on `--gradient-button` with a white bot glyph, `--shadow-button`, lifting 4px to `--shadow-lift` on hover. It opens a `Sheet` (popover at 95% with a heavy blur) holding the placeholder chat panel; the message list is `role="log"`. Dialog-based, so it inherits focus trap, Esc, and scroll lock.
- **WhatsApp button:** 56px pill in `whatsapp-green` with the `simple-icons` WhatsApp mark in white and a green-tinted shadow; opens wa.me in a new tab with a prefilled greeting. The only place that green appears.
- **Tooltip:** a decorative label to the left of each button on hover/focus (popover fill, strong hairline, 8px corners, `--shadow-card`); `aria-hidden` because the buttons carry their own names.

### Screenshot slider (case studies)

Embla carousel in `projects/[slug]/_components/`. Every slide shares one 16:10 stage inside a 24px-corner frame with a strong hairline; images are `object-contain` on `night-card-solid` (detail shots on a pale #f5f5f7 mat), so desktop, phone, and detail shots sit in the same frame without cropping. A device pill sits top-left; an expand affordance fades in bottom-right; clicking a slide opens the Lightbox at the same index (the index is shared both ways). Outline icon buttons on a popover wash step prev/next; arrow keys work. Below: a row of 88×56px thumbnails (12px corners, 2px border; active `--primary`, others 60% opacity) and a mono `n / N` counter (`aria-live="polite"`). Under reduced motion the slide transition is instant.

### Lightbox

A centred `<dialog>` at the `xl` width (80rem, fixed). The stage has a **fixed** height of `min(68dvh, 46rem)`, 16px corners, a hairline, and a 70% ground wash; images are `object-contain` with 8px of padding and fade/zoom in only under `motion-safe`. The frame never resizes between images. Arrow keys step through the set.

### Icons

- **UI glyphs:** `lucide-react`, 16px in buttons, `aria-hidden` beside visible text.
- **Tech and social marks:** `simple-icons` paths in brand colour. Near-black marks render in `currentColor`; dim marks (luma < 130) are lifted with `color-mix(in srgb, <hex> 60%, white)` so they hold 3:1 on dark tiles.

### Project covers

Real screenshots where they exist; otherwise a designed CSS/SVG cover illustration (`components/projects/cover-art*`) visibly labelled "illustration". Anonymized client work never shows client names or logos.

### Motion

- **Easings:** `--ease-spring` `cubic-bezier(0.34,1.2,0.64,1)` for hover lifts; `--ease-bounce` `cubic-bezier(0.34,1.56,0.64,1)` for the theme knob; `--ease-out-expo` `cubic-bezier(0.16,1,0.3,1)` for bars and `<details>`. The two overshoot curves are sanctioned exceptions in `.impeccable/config.json`.
- **Smooth scroll:** Lenis (`components/effects/smooth-scroll.tsx`, `lerp` 0.1) drives the real document scroll, so scroll-driven CSS keeps working. It is not started under reduced motion, stops while any `<dialog>` is open, lets dialogs and `[data-lenis-prevent]` boxes scroll natively, and offsets anchors by −96px. There is no CSS `scroll-behavior: smooth`.
- **Reveal:** `<Reveal>` sets `data-reveal`; a CSS scroll-driven `view()` animation rises content 28px with a 36px-per-item stagger, fully shown after 220px. It never hides content by script, is plain-visible without support or under reduced motion, and never wraps the hero.
- **Ambient loops:** hero glows float, stack logos orbit the portrait, the marquee scrolls, the constellation drifts (reading `--scene-*` emerald/cyan tokens; 70% opacity in day).
- **Sliding selection:** tabs and the `/projects` filter move one gradient pill (`components/ui/sliding-indicator.tsx`) to the active option with `--ease-spring` over 500ms, across wrapped rows too. Without JS, the active option paints its own pill. The theme knob slides with a Web Animation on `--ease-bounce` (next-themes disables CSS transitions during the swap).
- **Pause animations:** a footer control (`components/layout/motion-toggle.tsx`, Pause/Play icons) sets `data-motion="paused"` on `<html>`, remembered in localStorage and applied before paint. Looping and entry animations end at once, the typewriter holds its word, and the constellation stops; hover and state transitions stay. This is the WCAG 2.2.2 control for visitors who haven't set reduced motion.
- **Reduced motion:** every animation and transition collapses to 0.01ms, Lenis stays off, the slider switches instantly, and all ambient loops stop.

## Do's and Don'ts

### Do:

- **Do** use semantic token utilities only; the hex values in this file are documentation, `globals.css` is the source.
- **Do** keep to emerald and cyan, with two-stop gradients that start on emerald.
- **Do** design for night first and add `light:` overrides only where day differs.
- **Do** put white text and icons only on `--gradient-button`.
- **Do** use the `-strong` token whenever a hue is text.
- **Do** keep muted text at 0.64 (night) / 0.7 (day) alpha.
- **Do** give every responsive grid an explicit base column count and wrap `fr` tracks in `minmax(0,…)`.
- **Do** show screenshots `object-contain` in a fixed frame (16:10 slider stage, fixed-height lightbox stage) so the frame never jumps.
- **Do** build interactive primitives on `<dialog>`, `<details>`, and ARIA patterns in `src/components/ui/`.
- **Do** stop every loop and smooth scrolling under `prefers-reduced-motion`.

### Don't:

- **Don't** reintroduce violet, purple, pink, or any third brand hue, or a three-stop gradient.
- **Don't** use WhatsApp green anywhere but the WhatsApp button.
- **Don't** add shadcn, Radix, or a second dialog/tab/carousel implementation.
- **Don't** add CSS `scroll-behavior: smooth`; Lenis owns smooth scrolling.
- **Don't** follow the OS colour scheme or make light the default.
- **Don't** hide content with JavaScript for reveal effects.
- **Don't** gradient-fill text beyond the section-title highlight and the hero name.
- **Don't** set headings, buttons, or prose in JetBrains Mono.
- **Don't** use stock photos or unlabelled fake screenshots; use real screenshots or a labelled illustration.
- **Don't** introduce hard offset shadows or glow colours outside emerald and cyan.

## Setup status

Keep this in step with `src/app/globals.css` and ARCHITECTURE.md's Implementation status table.

| Item                                                                                                                                                                                  | Status                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Tailwind v4 via `postcss.config.mjs` (`@tailwindcss/postcss`), `tw-animate-css`                                                                                                       | Done. Without the PostCSS config Turbopack fails on `tw-animate-css`.                                    |
| Night (`:root, .dark`) and day (`.light`) emerald/cyan tokens, `@theme inline` mapping                                                                                                | Done; text pairs contrast-checked in both themes.                                                        |
| `@custom-variant dark` / `light`                                                                                                                                                      | Done.                                                                                                    |
| Fonts (Space Grotesk / Inter / JetBrains Mono via `next/font`)                                                                                                                        | Done.                                                                                                    |
| `ThemeProvider` (dark default, no system) and header theme switch                                                                                                                     | Done.                                                                                                    |
| Primitives in `src/components/ui/` (button, badge, card, field, dialog/sheet, lightbox, tabs with sliding indicator, accordion, tooltip, timeline, marquee, typewriter, stat counter) | Done, hand-built, no shadcn/Radix.                                                                       |
| Lightbox fixed frame (`xl` width, stage `min(68dvh,46rem)`, `object-contain`)                                                                                                         | Done.                                                                                                    |
| Case-study screenshot slider (Embla, 16:10 stage, thumbnails, `n / N` counter)                                                                                                        | Done.                                                                                                    |
| Floating actions (chatbot launcher + Sheet with placeholder chat panel, WhatsApp button)                                                                                              | Done; the assistant is a placeholder. On phones the stack steps aside while the hero CTAs are on screen. |
| Lenis smooth scroll (off under reduced motion, paused while a dialog is open)                                                                                                         | Done; CSS `scroll-behavior: smooth` removed.                                                             |
| CSS scroll-driven Reveal and scrolled header                                                                                                                                          | Done; Firefox and reduced motion get static, visible content.                                            |
| Three.js constellation reading `--scene-*` tokens                                                                                                                                     | Done (emerald/cyan).                                                                                     |
| Logo tile and favicon on `--gradient-button`                                                                                                                                          | Done (Deep Stops Rule).                                                                                  |
| Prettier with `prettier-plugin-tailwindcss` (`tailwindStylesheet` → `globals.css`)                                                                                                    | Done.                                                                                                    |
| Theme-switch colours, window-chrome dots, light screenshot stage, device body                                                                                                         | Done: tokenized (`--toggle-*`, `--traffic-*`, `--surface-light`, `--device`).                            |
