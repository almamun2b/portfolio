import type { CoverArt as CoverArtKind } from "@/lib/schemas/content";
import { Dashboard, Inbox, Terminal } from "./cover-art-data";
import { Course, Editor, Feed } from "./cover-art-scenes";
import { COVER_COPY } from "./cover-copy";

// Designed covers for work that has no public screenshot (anonymized client
// work, retired deployments). They are illustrations, labelled as such, built
// from the project's own vocabulary; never presented as real data.

export function CoverArt({ kind, slug }: { kind: CoverArtKind; slug: string }) {
  const copy = COVER_COPY[slug] ?? COVER_COPY.default;
  const lines = copy?.lines ?? [];
  return (
    <div className="relative size-full overflow-hidden bg-[radial-gradient(120%_90%_at_10%_0%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_60%),radial-gradient(90%_80%_at_100%_100%,color-mix(in_srgb,var(--secondary)_16%,transparent),transparent_60%)] p-4 pb-9 sm:p-5 sm:pb-10">
      {/* Content is clipped above the bottom strip the tag lives in. */}
      <div className="size-full overflow-hidden">
        {kind === "terminal" ? <Terminal lines={lines} /> : null}
        {kind === "dashboard" ? <Dashboard lines={lines} /> : null}
        {kind === "inbox" ? <Inbox lines={lines} /> : null}
        {kind === "editor" ? (
          <Editor lines={lines} image={copy?.image} />
        ) : null}
        {kind === "timeline" ? <Feed lines={lines} /> : null}
        {kind === "course" ? <Course lines={lines} /> : null}
      </div>
      <span className="absolute right-3 bottom-2 rounded-full border border-border bg-background/70 px-2 py-0.5 font-mono text-[0.62rem] text-muted-foreground backdrop-blur">
        illustration
      </span>
    </div>
  );
}
