import { cn } from "cn";
import type { ReactNode } from "react";
import { Container } from "./container";
import { SectionHeading } from "./section-heading";

/** Top of an inner page: the page's single h1, its intro, and optional extras. */
export function PageHero({
  path,
  title,
  highlight,
  description,
  aside,
  children,
  className,
}: {
  path: string;
  title: ReactNode;
  highlight?: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className={cn(
        "relative overflow-x-clip pt-14 pb-10 sm:pt-20 sm:pb-14",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/4 -z-10 size-[24rem] rounded-full bg-primary opacity-[0.1] blur-[70px]"
      />
      <Container
        className={cn(
          "grid grid-cols-1 items-center gap-12",
          aside && "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]",
        )}
      >
        <div className="flex flex-col gap-7">
          <SectionHeading
            id="page-title"
            as="h1"
            path={path}
            title={title}
            highlight={highlight}
            description={description}
          />
          {children}
        </div>
        {aside ? <div>{aside}</div> : null}
      </Container>
    </section>
  );
}
