// Primary navigation. Pages for the long-form routes; home-section anchors
// for content that only lives on the one-page home.
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
] as const;

export type NavItem = (typeof mainNav)[number];
