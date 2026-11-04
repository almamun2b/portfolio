/** Only the Admin role exists today; the check stays so a future role is denied by default. */
export const isAdminRole = (role: string): boolean => role === "ADMIN";

export const ADMIN_HOME = "/admin";
export const ADMIN_SIGN_IN = "/admin/sign-in";

/**
 * `next` comes from the URL, so only same-site admin paths are accepted;
 * anything else (absolute URLs, `//host`, backslashes) falls back to the
 * dashboard. Prevents an open redirect after sign-in.
 */
export function safeAdminPath(next: unknown): string {
  if (typeof next !== "string") return ADMIN_HOME;
  if (!next.startsWith("/admin") || next.startsWith("/admin/sign-in")) {
    return ADMIN_HOME;
  }
  if (next.includes("\\") || next.includes("//") || /[\r\n]/.test(next)) {
    return ADMIN_HOME;
  }
  const rest = next.slice("/admin".length);
  if (rest !== "" && !/^[/?#]/.test(rest)) return ADMIN_HOME;
  return next;
}
