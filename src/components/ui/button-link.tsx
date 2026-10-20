import { cn } from "cn";
import type { Route } from "next";
import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

/** A file served from /public, e.g. "/resume.pdf". */
export type AssetPath = `/${string}.${"pdf" | "png" | "jpg" | "webp" | "svg"}`;

type ButtonLinkProps = Omit<ComponentProps<"a">, "href"> &
  ButtonVariantProps & {
    /** Internal route, `#hash`, `mailto:`, `tel:`, `https:` URL, or a public file. */
    href: Route | AssetPath;
    /** Opens in a new tab with a safe `rel`. Defaults to true for http(s). */
    external?: boolean;
  };

const isHttp = (href: string) => /^https?:\/\//.test(href);

/**
 * A link that looks like a button. Internal routes go through next/link;
 * external, mailto:, tel:, and file downloads render a plain <a>.
 */
export function ButtonLink({
  href,
  external,
  className,
  variant,
  size,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const opensNewTab = external ?? isHttp(href);
  const isPlainAnchor =
    opensNewTab ||
    /^(mailto|tel):/.test(href) ||
    /\.[a-z0-9]+$/i.test(href) ||
    props.download !== undefined;

  if (isPlainAnchor) {
    return (
      <a
        href={href}
        className={classes}
        {...(opensNewTab ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      >
        {children}
        {opensNewTab ? (
          <span className="sr-only"> (opens in a new tab)</span>
        ) : null}
      </a>
    );
  }

  return (
    <Link href={href as Route} className={classes} {...props}>
      {children}
    </Link>
  );
}
