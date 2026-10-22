/** Hover/focus label to the left of a floating button (decorative; the button is named). */
export function WidgetTip({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-full mr-3 rounded-lg border border-border-strong bg-popover px-2.5 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}
