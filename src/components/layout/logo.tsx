import { cn } from "cn";
import Link from "next/link";

/** Monogram tile + name, linking home. The tile echoes uniqtrix's logo block. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative grid size-10 place-items-center rounded-[0.85rem] bg-gradient-button font-display text-lg font-bold text-white shadow-[0_6px_20px_var(--glow-primary)] transition-transform duration-500 ease-spring group-hover:scale-105 group-hover:-rotate-6 sm:size-11"
      >
        M
        <span className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-background bg-success" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Mamun
        </span>
        <span className="mt-1 hidden text-[0.72rem] text-muted-foreground sm:block">
          full-stack engineer
        </span>
      </span>
      <span className="sr-only">, home</span>
    </Link>
  );
}
