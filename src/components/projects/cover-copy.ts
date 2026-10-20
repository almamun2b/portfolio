// Labels drawn inside the designed covers (components/projects/cover-art).
// Illustrative UI text in each project's vocabulary; no client names and no
// figures that could read as results.
export const COVER_COPY: Record<
  string,
  { lines: string[]; image?: string } | undefined
> = {
  default: { lines: ["Overview", "Activity", "Settings"] },
  "fulfilment-inventory-platform": {
    lines: [
      "Inventory",
      "Orders",
      "Production",
      "Shipping",
      "Reports",
      "PO received · 16 variants",
      "Stocktake scheduled",
      "Order allocated · store 2",
      "Label printed",
    ],
  },
  "quantity-break-bundles": {
    lines: [
      "Bundles",
      "Analytics",
      "Widget",
      "Settings",
      "Billing",
      "Buy 2 · save 10%",
      "Buy 3 · save 15%",
      "Mix & match active",
    ],
  },
  "digital-wallet": {
    lines: [
      "Wallet",
      "Send money",
      "Cash in",
      "Agents",
      "Admin",
      "Transfer verified with PIN",
      "Cash-out by agent",
      "Fee applied",
    ],
  },
  "preorder-manager": {
    lines: [
      "Preorders",
      "Active",
      "Inactive",
      "Create",
      "Settings",
      "Preorder updated",
      "Status toggled",
      "Cache revalidated",
    ],
  },
  "library-management-system": {
    lines: [
      "Books",
      "Add book",
      "Borrow",
      "Summary",
      "Genres",
      "Borrowed · due in 14 days",
      "Copies updated",
      "Book added",
    ],
  },
  "lead-enrichment-pipeline": {
    lines: [
      "pnpm worker",
      "queue: claimed job (FOR UPDATE SKIP LOCKED)",
      "session: advisory lock acquired",
      "budget: within hourly limit · circuit closed",
      "enrich: website found · email scored high",
      "snapshot stored (compressed)",
    ],
  },
  "supplier-catalogue-sync": {
    lines: [
      "pnpm import --supplier api",
      "fetch: catalogue pages streamed",
      "normalise: product types detected",
      "diff: price changes ready for review",
      "images: scraped from sitemap",
      "publish: store 1 ✓  store 2 ✓",
    ],
  },
  "fullstack-starter-kit": {
    lines: [
      "pnpm create app",
      "auth: access + refresh tokens (httpOnly)",
      "rbac: user · admin",
      "query builder: filter, search, paginate",
      "redis: token blacklist ready",
      "husky + lint-staged installed",
    ],
  },
  "contact-discovery-cli": {
    lines: [
      "pnpm crawl websites/list.csv",
      "robots.txt respected · sitemap seeded",
      "contact page found (priority crawl)",
      "decoded obfuscated address",
      "ssrf guard: private IP blocked",
      "results written + summary log",
    ],
  },
  "email-campaign-platform": {
    lines: [
      "Spring newsletter · segment A",
      "Product update · customers",
      "Welcome series · step 2",
      "Re-engagement · inactive 90d",
      "Event invite · partners",
    ],
  },
  "product-design-customizer": {
    lines: ["YOUR LOGO", "Front", "Back", "Left", "Right", "Text", "Upload"],
    image: "/projects/product-design-customizer/blank-cap.png",
  },
  widerml: {
    lines: ["YOUR BRAND", "Hero", "Features", "Pricing", "Launch plan"],
  },
  "team-hub": {
    lines: [
      "Goal updated: Q3 launch milestones",
      "New announcement from the team lead",
      "3 action items moved to Done",
      "Workspace invite accepted",
      "Comment on the roadmap thread",
    ],
  },
  "social-media-archiving-platform": {
    lines: [
      "Archive complete: all posts and media",
      "Alert: login from a new device",
      "Mailbox backup finished",
      "Suspicious link detected in messages",
      "Weekly activity report ready",
    ],
  },
  "e-learning-platform": {
    lines: [
      "Mobile Device Servicing",
      "Module 1 · Diagnostics",
      "Module 2 · Board repair",
      "Module 3 · Parts",
      "Resources (PDF)",
      "Certificate",
    ],
  },
  "now-health": {
    lines: [
      "Health cover, local to you",
      "Individuals",
      "Companies",
      "Consultancy",
      "Third-party admin",
      "Choose language",
    ],
  },
  "remoterecruit-landing": {
    lines: [
      "Find remote talent, faster",
      "For companies",
      "For talent",
      "Pricing",
      "Get started",
    ],
  },
  "travel-buddy": {
    lines: [
      "Trip to Cox's Bazar · 3 travellers matched",
      "New review from a travel partner",
      "Plan created: Sylhet tea gardens",
      "Profile verified",
      "Join request accepted",
    ],
  },
};
