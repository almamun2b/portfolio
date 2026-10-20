import { cn } from "cn";
import Image from "next/image";
import { panel } from "./cover-art-panel";

// Scene-style cover illustrations: editor, feed, course.

export function Editor({ lines, image }: { lines: string[]; image?: string }) {
  return (
    <div className="grid h-full grid-cols-[2.5rem_1fr_6rem] gap-3">
      <div className={cn(panel, "flex flex-col items-center gap-2 py-3")}>
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "size-5 rounded-md",
              n === 1 ? "bg-gradient-button" : "bg-muted",
            )}
          />
        ))}
      </div>
      <div
        className={cn(
          panel,
          "relative grid place-items-center overflow-hidden",
          image && "bg-white",
        )}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="20rem"
            className="object-contain p-3"
          />
        ) : (
          <div className="aspect-[4/3] w-3/4 rounded-[40%_40%_18%_18%] bg-[#1b1d2a] shadow-inner" />
        )}
        <span className="absolute top-[34%] rounded-md border-2 border-dashed border-secondary px-3 py-1.5 font-display text-[0.65rem] font-bold text-white">
          {lines[0] ?? "YOUR LOGO"}
        </span>
      </div>
      <div className={cn(panel, "flex flex-col gap-2 p-2")}>
        {lines.slice(1).map((line) => (
          <span
            key={line}
            className="truncate rounded-md bg-muted px-1.5 py-1 text-[0.58rem] text-muted-foreground"
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Feed({ lines }: { lines: string[] }) {
  return (
    <div className="flex h-full flex-col gap-2.5">
      {lines.map((line, i) => (
        <div
          key={line}
          className={cn(
            panel,
            "flex items-center gap-3 p-2.5",
            i % 2 === 1 && "ml-8",
          )}
        >
          <span className="size-7 shrink-0 rounded-full bg-gradient-brand opacity-80" />
          <span className="flex-1 truncate text-[0.68rem] text-foreground/85">
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Course({ lines }: { lines: string[] }) {
  return (
    <div className="grid h-full grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">
      <div
        className={cn(
          panel,
          "flex flex-col justify-end gap-2 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--primary)_40%,transparent),transparent)] p-4",
        )}
      >
        <span className="font-display text-sm font-bold text-foreground">
          {lines[0]}
        </span>
        <span className="h-1.5 w-2/3 rounded-full bg-border-strong">
          <span className="block h-full w-1/2 rounded-full bg-secondary" />
        </span>
      </div>
      <div className={cn(panel, "flex flex-col gap-1.5 p-3")}>
        {lines.slice(1).map((line) => (
          <span
            key={line}
            className="truncate text-[0.62rem] text-muted-foreground"
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
