import { cn } from "cn";
import Image, { type StaticImageData } from "next/image";

const SIZES = { sm: 40, md: 56, lg: 96, xl: 160 } as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Round avatar: an image when there is one, initials otherwise. */
export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: StaticImageData | string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const px = SIZES[size];
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-button font-display font-semibold text-primary-foreground ring-2 ring-border-strong",
        className,
      )}
      style={{ width: px, height: px, fontSize: px * 0.36 }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          sizes={`${String(px)}px`}
          className="size-full object-cover"
        />
      ) : (
        <span aria-label={name} role="img">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
