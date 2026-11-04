import { ADMIN_COOKIE } from "./nav-config";

// The collapsed choice lives on <html data-admin-sidebar="collapsed">, set
// before first paint by SIDEBAR_INIT_SCRIPT, so the prerendered frame has the
// right width without reading a request cookie. Styles key off it (the
// `rail:` and `collapsed:` variants in globals.css).
export const SIDEBAR_ATTR = "data-admin-sidebar";

/** Inline in the dashboard layout: copies the remembered cookie to <html>. */
export const SIDEBAR_INIT_SCRIPT = `try{if(document.cookie.split("; ").includes("${ADMIN_COOKIE}=collapsed"))document.documentElement.setAttribute("${SIDEBAR_ATTR}","collapsed")}catch(e){}`;
