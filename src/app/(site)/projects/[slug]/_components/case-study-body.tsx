import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/effects/reveal";
import { TechIcon } from "@/components/icons/tech-icon";
import type { Project } from "@/lib/schemas/content";
import { getTech } from "@/lib/tech";

function Block({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal as="section" className="flex flex-col gap-4">
      <h2 id={id} className="text-2xl font-semibold">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 leading-relaxed text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary-strong"
          >
            <Check className="size-3" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Problem → approach → my part → outcomes, with the stack beside it. */
export function CaseStudyBody({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-16">
      <div className="flex max-w-3xl flex-col gap-12">
        <Block id="problem" title="The problem">
          <p className="text-[1.05rem] leading-[1.8] text-muted-foreground">
            {project.problem}
          </p>
        </Block>
        <Block id="approach" title="How it works">
          <Bullets items={project.approach} />
        </Block>
        {project.myPart ? (
          <Block id="my-part" title="What I built">
            <Bullets items={project.myPart} />
          </Block>
        ) : null}
        <Block id="outcomes" title="Outcome">
          <Bullets items={project.outcomes} />
        </Block>
      </div>
      <aside
        aria-labelledby="stack-title"
        className="lg:sticky lg:top-28 lg:self-start"
      >
        <div className="flex flex-col gap-5 rounded-3xl border border-border glass p-6">
          <h2 id="stack-title" className="font-display text-lg font-semibold">
            Built with
          </h2>
          <ul className="grid grid-cols-2 gap-2.5">
            {project.stack.map((id) => (
              <li
                key={id}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground"
              >
                <TechIcon id={id} className="size-4" />
                {getTech(id).label}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
