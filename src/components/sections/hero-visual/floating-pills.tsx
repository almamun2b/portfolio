import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

export interface Pill {
  label: string;
  icon: LucideIcon;
  tone: "primary" | "secondary" | "accent" | "success";
}

// From `sm` up, the corners and bottom edge sit outside the outer orbit (88%
// diameter), so the pills never cover a passing logo. Phones are too narrow
// for that, so the pills drop into a row under the visual instead.
const POSITIONS = [
  "sm:top-0 sm:-left-[3%]",
  "sm:top-0 sm:-right-[3%]",
  "sm:-bottom-[2%] sm:left-1/2 sm:-translate-x-1/2",
] as const;

const TONES: Record<Pill["tone"], string> = {
  primary: "text-primary-strong border-primary/40",
  secondary: "text-secondary-strong border-secondary/40",
  accent: "text-accent-strong border-accent/40",
  success: "text-success border-success/40",
};

/** Glass facts floating around the portrait (uniqtrix's tech-float pills). */
export function FloatingPills({ pills }: { pills: Pill[] }) {
  return (
    <ul
      aria-label="Highlights"
      className="absolute inset-x-0 top-full mt-5 flex flex-wrap justify-center gap-2 sm:contents"
    >
      {pills.slice(0, POSITIONS.length).map((pill, i) => {
        const Icon = pill.icon;
        return (
          <li
            key={pill.label}
            className={cn(
              "z-20 sm:absolute motion-safe:sm:animate-bob",
              POSITIONS[i],
            )}
            style={
              { "--bob-duration": `${String(3.8 + i * 0.7)}s` } as CSSProperties
            }
          >
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border bg-[color-mix(in_srgb,var(--card-solid)_78%,transparent)] px-3 py-1.5 font-display text-[0.72rem] font-semibold whitespace-nowrap text-foreground shadow-card backdrop-blur-md sm:px-4 sm:py-2 sm:text-[0.8rem]",
                TONES[pill.tone],
              )}
            >
              <Icon aria-hidden="true" className="size-3.5 sm:size-4" />
              <span className="text-foreground">{pill.label}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
