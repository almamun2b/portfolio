---
version: 1
slug: "src-app-site-page-tsx"
primary_target: "src/app/(site)/page.tsx"
related_targets: ["src/app/(site)/projects/[slug]/page.tsx","src/app/(site)/about/page.tsx"]
---

## Scope

Portfolio site: one-page home plus /about, /projects, /projects/[slug], /contact. Mode: Persuade (recruiters and clients decide to make contact), with Experience on the project case studies.

## Audience and job

Recruiters and hiring managers, plus contract clients. Within the first viewport they need the role, years of experience, stack, and a way to act (contact, CV). Proof comes from projects with real screenshots.

## Direction contract

THESIS: A two-hue night-sky console where the engineer stands at the centre of his own stack. It refuses the template-portfolio default of centered name, typed subtitle, and a grid of identical cards.
OWN-WORLD: The uniqtrix world, pinned by the owner. A near-black ground with primary and secondary glows from the active palette (violet → indigo, the owner's choice; every saved palette is in src/styles/color-systems/), glass panels with primary hairlines, pill buttons, a Three.js constellation, Space Grotesk headings, Inter body text, and mono file-path labels.
STORY: Visitors see who he is and what he ships, open a case study with real screenshots, then email him or take the CV.
FIRST VIEWPORT: Left column: availability pill, h1 name, typed role line, one-sentence pitch, primary "View my work" and secondary "Download CV" buttons, socials. Right column: circular portrait in a gradient ring with two counter-rotating orbits of stack logos and floating glass pills. Sticky glass header above, with no privacy bar.
FORM: Pinned by the owner (uniqtrix clone style). concept-seed was not run, because the brief pins the world. Seed key: none (pinned).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: the hero orbit, with stack logos circling the portrait, paired with the constellation reacting to the cursor. Motion grammar: spring lift on hover, staggered rise on reveal, and a slow ambient drift. Everything stops under reduced motion.

## Unresolved

The hero visual may be swapped later; keep it behind the HeroVisual slot.
