import { cn } from "cn";
import { getTech, type TechId } from "@/lib/tech";

// Brand colours that are near-black vanish on the dark theme; draw those in
// the text colour instead.
function luma(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * A technology's logo (simple-icons) or a neutral glyph. Decorative by
 * default: pair it with a visible label, or pass `title` to expose it.
 * Logos are <use> references into /tech-sprite.svg (app/tech-sprite.svg),
 * which the browser fetches once and caches across pages.
 */
export function TechIcon({
  id,
  className,
  title,
  monochrome = false,
}: {
  id: TechId;
  className?: string;
  title?: string;
  monochrome?: boolean;
}) {
  const { icon, label } = getTech(id);
  const a11y = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  if (icon.kind === "glyph") {
    const Glyph = icon.icon;
    return (
      <Glyph
        className={cn("size-5 text-primary-strong", className)}
        {...a11y}
      />
    );
  }
  // Near-black marks use the text colour; dim ones (PostgreSQL, Redux) are
  // lifted toward white on the dark theme so they keep 3:1 on their tile.
  const l = luma(icon.hex);
  const color =
    monochrome || l < 60
      ? "currentColor"
      : l < 130
        ? `color-mix(in srgb, ${icon.hex} 60%, white)`
        : icon.hex;
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      style={{ fill: color }}
      data-tech={label}
      {...a11y}
    >
      <use href={`/tech-sprite.svg#${id}`} />
    </svg>
  );
}
