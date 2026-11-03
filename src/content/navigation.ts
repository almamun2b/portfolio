// Primary navigation. Pages for the long-form routes; home-section anchors
// for content that only lives on the one-page home.
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
] as const;

// Shown only once there is a published post (see getMainNav).
export const blogNav = { label: "Blog", href: "/blog" } as const;

export type NavItem = (typeof mainNav)[number] | typeof blogNav;
