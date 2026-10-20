import { cn } from "cn";
import type { ReactNode } from "react";

/**
 * Section title in the uniqtrix pattern: the final words carry the brand
 * gradient. `path` is a small file-path label (the developer's own world:
 * where this content lives), shown above the title.
 */
export function SectionHeading({
  id,
  path,
  title,
  highlight,
  description,
  align = "left",
  as: Heading = "h2",
  actions,
  className,
}: {
  id?: string;
  path?: string;
  title: ReactNode;
  highlight?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        actions && "lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-w-3xl flex-col gap-4",
          align === "center" && "items-center",
        )}
      >
        {path ? (
          <p className="font-mono text-[0.8rem] text-secondary-strong">
            <span aria-hidden="true" className="text-muted-foreground">
              ~/
            </span>
            {path}
          </p>
        ) : null}
        <Heading
          id={id}
          className={cn(
            "font-bold tracking-tight text-foreground",
            Heading === "h1"
              ? "text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05]"
              : "text-[clamp(1.85rem,4vw,3rem)] leading-[1.1]",
          )}
        >
          {title}
          {highlight ? (
            <>
              {" "}
              <span className="text-gradient">{highlight}</span>
            </>
          ) : null}
        </Heading>
        {description ? (
          <p className="max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
