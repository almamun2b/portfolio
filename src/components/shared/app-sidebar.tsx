"use client";

import {
  GalleryVerticalEnd,
  Lock,
  Newspaper,
  Projector,
  Type,
  Upload,
  User,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/modules/Dashboard/nav-main";
import { NavSettings } from "@/components/modules/Dashboard/nav-settings";
import { NavUser } from "@/components/modules/Dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Projects",
      url: "#",
      icon: Projector,
      isActive: true,
      items: [
        {
          title: "All Projects",
          url: "/projects",
        },
        {
          title: "Create Project",
          url: "/projects/create",
        },
      ],
    },
    {
      title: "Blog Category",
      url: "#",
      icon: Type,
      isActive: true,
      items: [
        {
          title: "All Categories",
          url: "/blog-category",
        },
        {
          title: "Create Category",
          url: "/blog-category/create",
        },
      ],
    },
    {
      title: "Blogs",
      url: "#",
      icon: Newspaper,
      isActive: true,
      items: [
        {
          title: "All Blogs",
          url: "/blogs",
        },
        {
          title: "Create Blog",
          url: "/blogs/create",
        },
      ],
    },
  ],
  settings: [
    {
      name: "Profile",
      url: "/profile",
      icon: User,
    },
    {
      name: "Update Profile",
      url: "#",
      icon: Upload,
    },
    {
      name: "Update Password",
      url: "#",
      icon: Lock,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 mb-2 border-b flex flex-row">
        <div className="text-sidebar-accent-foreground flex items-center gap-2 py-1.5">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-lg leading-tight">
            <span className="truncate font-medium">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSettings settings={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
