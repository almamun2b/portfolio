import { TechIcon } from "@/components/icons/tech-icon";
import { Marquee } from "@/components/ui/marquee";
import { getTech, type TechId } from "@/lib/tech";

/** The stack I ship with, as uniqtrix's partner-logo ticker. */
export function TechMarquee({ stack }: { stack: TechId[] }) {
  return (
    <div className="relative border-y border-border bg-[color-mix(in_srgb,var(--background)_55%,transparent)] py-6 backdrop-blur-sm">
      <Marquee label="Technologies I work with">
        {stack.map((id) => (
          <li
            key={id}
            className="flex items-center gap-3 border-r border-border px-8 py-1 font-display text-[1.05rem] font-semibold whitespace-nowrap text-muted-foreground sm:px-12"
          >
            <TechIcon id={id} className="size-6" />
            {getTech(id).label}
          </li>
        ))}
      </Marquee>
    </div>
  );
}
