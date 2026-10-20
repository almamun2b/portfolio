import { cn } from "cn";
import { panel } from "./cover-art-panel";

// Data-style cover illustrations: terminal, dashboard, inbox.

export function Terminal({ lines }: { lines: string[] }) {
  return (
    <div
      className={cn(
        panel,
        "h-full p-4 font-mono text-[0.68rem] leading-relaxed sm:text-xs",
      )}
    >
      {lines.map((line, i) => (
        <p
          key={line}
          className={cn(
            "truncate",
            i === 0 ? "text-secondary-strong" : "text-muted-foreground",
          )}
        >
          {i === 0 ? (
            <span className="text-success">$ </span>
          ) : (
            <span className="text-primary-strong">› </span>
          )}
          {line}
        </p>
      ))}
      <span
        aria-hidden="true"
        className="mt-1 inline-block h-3.5 w-2 bg-secondary motion-safe:animate-caret"
      />
    </div>
  );
}

export function Dashboard({ lines }: { lines: string[] }) {
  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3">
      <div className={cn(panel, "flex flex-col gap-2 p-3")}>
        {lines.slice(0, 5).map((line, i) => (
          <span
            key={line}
            className={cn(
              "truncate rounded-md px-2 py-1 text-[0.66rem]",
              i === 0
                ? "bg-gradient-button text-white"
                : "text-muted-foreground",
            )}
          >
            {line}
          </span>
        ))}
      </div>
      <div className="grid grid-rows-[auto_1fr] gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[64, 38, 82].map((h, i) => (
            <div
              key={h}
              className={cn(panel, "flex h-14 flex-col justify-end gap-1 p-2")}
            >
              <span className="h-1.5 w-1/2 rounded-full bg-border-strong" />
              <span
                className={cn(
                  "h-2.5 rounded-full",
                  i === 1 ? "bg-secondary/70" : "bg-primary/70",
                )}
                style={{ width: `${String(h)}%` }}
              />
            </div>
          ))}
        </div>
        <div className={cn(panel, "flex flex-col gap-1.5 p-3")}>
          {lines.slice(5).map((line) => (
            <span
              key={line}
              className="flex items-center justify-between gap-2 border-b border-border pb-1 text-[0.62rem] text-muted-foreground last:border-0"
            >
              <span className="truncate">{line}</span>
              <span className="size-1.5 shrink-0 rounded-full bg-success" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Inbox({ lines }: { lines: string[] }) {
  return (
    <div className={cn(panel, "flex h-full flex-col divide-y divide-border")}>
      {lines.map((line, i) => (
        <div key={line} className="flex items-center gap-3 px-3 py-2.5">
          <span
            className={cn(
              "size-6 shrink-0 rounded-full",
              i % 2 ? "bg-secondary/40" : "bg-primary/50",
            )}
          />
          <span className="flex-1 truncate text-[0.68rem] text-foreground/85">
            {line}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.58rem]",
              i === 0
                ? "bg-success/20 text-success"
                : "bg-muted text-muted-foreground",
            )}
          >
            {i === 0 ? "sending" : "queued"}
          </span>
        </div>
      ))}
    </div>
  );
}
