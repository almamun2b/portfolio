import {
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  Newspaper,
  ScrollText,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

// The single registry of admin modules. It drives the sidebar, the dashboard's
// module cards, and the breadcrumbs. A new module is one entry here plus its
// route folder under src/app/admin/(dashboard)/ (ARCHITECTURE.md › Modules).

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** "soon" modules render a Coming soon page and a badge. */
  status: "ready" | "soon";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        description: "Activity and system overview.",
        icon: LayoutDashboard,
        status: "ready",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        description: "Add, edit, disable, and remove admin accounts.",
        icon: Users,
        status: "ready",
      },
      {
        href: "/admin/audit-log",
        label: "Audit log",
        description: "Who signed in and what changed.",
        icon: ScrollText,
        status: "ready",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        href: "/admin/projects",
        label: "Projects",
        description: "Case studies and portfolio work.",
        icon: FolderKanban,
        status: "soon",
      },
      {
        href: "/admin/blogs",
        label: "Blogs",
        description: "Articles and notes.",
        icon: Newspaper,
        status: "soon",
      },
      {
        href: "/admin/professions",
        label: "Professions",
        description: "Roles, experience, and services.",
        icon: BriefcaseBusiness,
        status: "soon",
      },
      {
        href: "/admin/categories",
        label: "Categories",
        description: "Shared taxonomy for content.",
        icon: Tags,
        status: "soon",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/admin/settings",
        label: "Settings",
        description: "Site-wide configuration.",
        icon: Settings,
        status: "soon",
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export const ADMIN_COOKIE = "admin-sidebar";

/** Active when the path matches; "/admin" only matches exactly. */
export function isActive(href: string, pathname: string): boolean {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}
