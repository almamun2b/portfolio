import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

/**
 * Collapse / expand control. It sits on the sidebar's right edge, level with
 * the brand, so it stays put (and in reach) in both states.
 */
export function SidebarToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      aria-expanded={!collapsed}
      aria-controls="admin-sidebar"
      className="absolute top-[1.125rem] -right-3.5 grid size-7 cursor-pointer place-items-center rounded-full border border-border-strong bg-card-solid text-muted-foreground shadow-card transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
}
