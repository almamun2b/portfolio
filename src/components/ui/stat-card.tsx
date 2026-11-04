import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "./card";

/** One headline number with a label. */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn("flex items-start justify-between gap-4 p-5", className)}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <data
          value={typeof value === "number" ? value : undefined}
          className="font-display text-3xl font-bold tracking-tight"
        >
          {value}
        </data>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border-strong bg-gradient-tile text-primary-strong"
      >
        <Icon className="size-5" />
      </span>
    </Card>
  );
}
