import type { Shot } from "@/lib/schemas/content";

// Hand-picked images for projects with no public URL to capture. Every file
// here was reviewed for client names, logos, store URLs, and personal data
// before it was added (PRODUCT.md › anonymized Xubitar work). Now Health is
// named client work: 16:10 crops of the owner's full-page captures.
export const manualMedia: Record<string, Shot[]> = {
  "fulfilment-inventory-platform": [
    {
      src: "/projects/fulfilment-inventory-platform/inventory-redacted.png",
      width: 2560,
      height: 1600,
      alt: "Inventory workspace: product details, pricing and margin per store, and a variant stock matrix with purchase orders, stocktakes, and adjustments below. Store and supplier details are blurred.",
      device: "desktop",
    },
  ],
  "now-health": [
    {
      src: "/projects/now-health/home-hero.jpg",
      width: 1440,
      height: 900,
      alt: 'Now Health home page: headline "Insurance that actually moves with you" above a row of member photos, with the main navigation, language switch, and Get a quote button.',
      device: "desktop",
    },
    {
      src: "/projects/now-health/home-plans.jpg",
      width: 1440,
      height: 900,
      alt: "Plan comparison on the home page: SimpleCare and WorldCare cards, each listing its benefits with a Get a quote button.",
      device: "desktop",
    },
    {
      src: "/projects/now-health/home-tools.jpg",
      width: 1440,
      height: 900,
      alt: "Digital tools section: member card, pre-approvals, claim tracking, and hospital search beside a phone mock-up of the member app, with app-store badges.",
      device: "desktop",
    },
    {
      src: "/projects/now-health/simple-care.jpg",
      width: 1440,
      height: 900,
      alt: "SimpleCare product page: hero with a quote button and family photo, followed by in-page navigation for plan features, benefits table, and plan comparison.",
      device: "desktop",
    },
    {
      src: "/projects/now-health/medical-providers.jpg",
      width: 1440,
      height: 900,
      alt: "Medical providers page: a patient-eligibility check by membership or Emirates ID, treatment date, and date of birth.",
      device: "desktop",
    },
  ],
  "quantity-break-bundles": [
    {
      src: "/projects/quantity-break-bundles/widget-tiers.png",
      width: 717,
      height: 580,
      alt: "Storefront bundle widget with three quantity tiers, savings badges, and a free-gift row.",
      device: "detail",
    },
    {
      src: "/projects/quantity-break-bundles/widget-compact.png",
      width: 626,
      height: 573,
      alt: "Compact variant of the bundle widget template.",
      device: "detail",
    },
  ],
};
