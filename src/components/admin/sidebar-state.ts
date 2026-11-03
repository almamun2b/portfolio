import { useEffect, useSyncExternalStore } from "react";
import { SIDEBAR_ATTR as ATTR } from "./sidebar-init";
import { ADMIN_COOKIE } from "./nav-config";

// React's view of the collapsed choice, which lives on
// <html data-admin-sidebar="collapsed"> (see sidebar-init.ts). Styles key off
// the attribute; React only mirrors it for the toggle's label and aria-expanded.

function isCollapsed(): boolean {
  return document.documentElement.getAttribute(ATTR) === "collapsed";
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ATTR],
  });
  return () => {
    observer.disconnect();
  };
}

export function toggleSidebar(): void {
  const next = !isCollapsed();
  if (next) document.documentElement.setAttribute(ATTR, "collapsed");
  else document.documentElement.removeAttribute(ATTR);
  document.cookie = `${ADMIN_COOKIE}=${next ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`;
}

export function useSidebarCollapsed(): boolean {
  const collapsed = useSyncExternalStore(subscribe, isCollapsed, () => false);
  // The init script doesn't run on a client navigation into /admin from the
  // site; restore the remembered choice then.
  useEffect(() => {
    if (document.cookie.split("; ").includes(`${ADMIN_COOKIE}=collapsed`)) {
      document.documentElement.setAttribute(ATTR, "collapsed");
    }
  }, []);
  return collapsed;
}
