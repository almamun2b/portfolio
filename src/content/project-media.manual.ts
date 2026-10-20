import type { Shot } from "@/lib/schemas/content";

// Hand-picked images for projects with no public URL to capture. Every file
// here was reviewed for client names, logos, store URLs, and personal data
// before it was added (PRODUCT.md › anonymized Xubitar work).
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
