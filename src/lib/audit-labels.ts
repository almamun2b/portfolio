const LABELS: Record<string, string> = {
  "auth.signin": "Signed in",
  "auth.signin.failed": "Failed sign-in attempt",
  "auth.signin.blocked": "Sign-in blocked (too many attempts)",
  "auth.signout": "Signed out",
  "auth.password.change": "Changed their password",
  "auth.password.change_failed": "Failed password change",
  "user.create": "Created a user",
  "user.update": "Updated a user",
  "user.disable": "Disabled a user",
  "user.enable": "Enabled a user",
  "user.delete": "Deleted a user",
  "user.password.reset": "Set a user's password",
  "category.create": "Created a category",
  "category.update": "Updated a category",
  "category.delete": "Deleted a category",
  "project.create": "Created a project",
  "project.update": "Updated a project",
  "project.delete": "Deleted a project",
  "post.create": "Created a blog post",
  "post.update": "Updated a blog post",
  "post.delete": "Deleted a blog post",
  "message.update": "Changed a message's status",
  "message.delete": "Deleted a message",
  "settings.update": "Updated site settings",
  "session.revoke": "Revoked a session",
  "session.revoke_all": "Revoked all sessions",
};

export function auditLabel(action: string): string {
  return LABELS[action] ?? action;
}

/** Failures and destructive actions get the danger badge. */
export function auditTone(action: string): "danger" | "success" | "default" {
  if (/failed|blocked|delete|disable/.test(action)) return "danger";
  if (/^auth\.signin$|create|enable/.test(action)) return "success";
  return "default";
}

export const AUDIT_AREAS = [
  { value: "auth", label: "Sign-in & passwords" },
  { value: "user", label: "Users" },
  { value: "session", label: "Sessions" },
  { value: "project", label: "Projects" },
  { value: "post", label: "Blog posts" },
  { value: "category", label: "Categories" },
  { value: "message", label: "Messages" },
  { value: "settings", label: "Settings" },
] as const;
