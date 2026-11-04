import { cn } from "cn";
import Image from "next/image";

/** Small stable hash, so a title always gets the same cover. */
function hash(text: string): number {
  let h = 2166136261;
  for (const char of text) {
    h ^= char.codePointAt(0) ?? 0;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

/**
 * Cover for a post: its image when there is one, otherwise a designed
 * placeholder built from the theme tokens. The placeholder is decorative and
 * deterministic: the same title always lays out the same glow and grid.
 */
export function PostCover({
  title,
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  title: string;
  src: string | null;
  alt: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const h = hash(title);
  const glowA = `${String(h % 70)}% ${String((h >> 8) % 60)}%`;
  const glowB = `${String(40 + ((h >> 16) % 60))}% ${String(40 + ((h >> 4) % 60))}%`;
  const remote = src?.startsWith("https://") ?? false;

  return (
    <div
      className={cn(
        "relative aspect-[16/9] overflow-hidden rounded-2xl border border-border-strong bg-card-solid",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          preload={priority}
          unoptimized={remote}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center"
          style={{
            backgroundImage: `radial-gradient(60% 80% at ${glowA}, color-mix(in srgb, var(--primary) 26%, transparent), transparent 70%), radial-gradient(55% 75% at ${glowB}, color-mix(in srgb, var(--secondary) 20%, transparent), transparent 70%), radial-gradient(color-mix(in srgb, var(--foreground) 14%, transparent) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 100% 100%, 18px 18px",
          }}
        >
          <span className="font-display text-6xl font-bold tracking-tight text-primary-strong/70 select-none sm:text-7xl">
            {initials(title)}
          </span>
        </div>
      )}
    </div>
  );
}
