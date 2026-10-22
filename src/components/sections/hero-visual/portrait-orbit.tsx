import { cn } from "cn";
import Image from "next/image";
import type { CSSProperties } from "react";
import { TechIcon } from "@/components/icons/tech-icon";
import type { TechId } from "@/lib/tech";
import portrait from "@/assets/portrait-cutout.png";
import { FloatingPills, type Pill } from "./floating-pills";

/**
 * Hero visual: the portrait stands in a gradient disc (head breaking out of
 * the top), with two counter-rotating orbits of stack logos and floating
 * glass pills. Pure CSS motion; it stops under reduced motion. Swap the whole
 * component to change the hero visual (Hero takes it as a slot).
 */
export function PortraitOrbit({
  name,
  pills,
  stack,
}: {
  name: string;
  pills: Pill[];
  /** Logos for the orbits: the first six go outside, the next four inside. */
  stack: TechId[];
}) {
  const outer = stack.slice(0, 6);
  const inner = stack.slice(6, 10);
  return (
    <div className="relative mx-auto mb-24 aspect-square w-[min(100%,19.5rem)] sm:mb-0 sm:w-[min(100%,28rem)] lg:w-[min(100%,34rem)]">
      <div
        aria-hidden="true"
        className="absolute inset-[12%] rounded-full bg-gradient-brand opacity-30 blur-3xl motion-safe:animate-glow-float"
      />
      <Orbit items={outer} diameter={88} duration="56s" offset={Math.PI / 6} />
      <Orbit
        items={inner}
        diameter={70}
        duration="40s"
        offset={Math.PI / 4}
        reverse
      />

      <div
        aria-hidden="true"
        className="absolute inset-[21%] rounded-full bg-gradient-brand p-[3px] shadow-[0_0_60px_var(--glow-primary)]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--primary)_35%,var(--card-solid)),var(--card-solid)_70%)]" />
      </div>

      {/* Same width as the disc and bottom-aligned with it; the rounded
          bottom clips the body to the disc while the head rises above. */}
      <div className="absolute inset-x-[21%] top-[1%] bottom-[21%] overflow-hidden rounded-b-full">
        <Image
          src={portrait}
          alt={`Portrait of ${name}, arms crossed, smiling`}
          fill
          preload
          fetchPriority="high"
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 18rem, 13rem"
          placeholder="blur"
          className="object-cover object-top"
        />
      </div>

      <FloatingPills pills={pills} />
    </div>
  );
}

function Orbit({
  items,
  diameter,
  duration,
  offset = 0,
  reverse = false,
}: {
  items: TechId[];
  diameter: number;
  duration: string;
  /** Start angle (radians) so logos never rest under the head or on each other. */
  offset?: number;
  reverse?: boolean;
}) {
  const style = { "--orbit-duration": duration } as CSSProperties;
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-dashed border-border-strong"
      style={{ width: `${String(diameter)}%`, height: `${String(diameter)}%` }}
    >
      <div
        className={cn(
          "size-full",
          reverse
            ? "motion-safe:animate-orbit-reverse"
            : "motion-safe:animate-orbit",
        )}
        style={style}
      >
        {items.map((id, i) => {
          const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2 + offset;
          return (
            <div
              key={id}
              className="absolute -translate-1/2"
              style={{
                left: `${(50 + 50 * Math.cos(angle)).toFixed(2)}%`,
                top: `${(50 + 50 * Math.sin(angle)).toFixed(2)}%`,
              }}
            >
              <div
                className={
                  reverse
                    ? "motion-safe:animate-orbit"
                    : "motion-safe:animate-orbit-reverse"
                }
                style={style}
              >
                {/* Tinted, not `glass`: a backdrop blur on a moving chip is
                    re-rasterised every frame. */}
                <span className="grid size-9 place-items-center rounded-xl border border-border-strong bg-[color-mix(in_srgb,var(--card-solid)_82%,transparent)] shadow-card sm:size-12 sm:rounded-2xl">
                  <TechIcon id={id} className="size-4 sm:size-6" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
