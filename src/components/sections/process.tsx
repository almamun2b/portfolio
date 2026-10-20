import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/effects/reveal";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import type { ProcessStep } from "@/lib/schemas/content";

/**
 * uniqtrix's "How we work" timeline: numbered nodes on a gradient track. The
 * numbers carry the order of the steps, so they stay.
 */
export function Process({ steps }: { steps: ProcessStep[] }) {
  return (
    <Section id="process" aria-labelledby="process-title">
      <SectionHeading
        id="process-title"
        path="process"
        title="How I"
        highlight="work"
        align="center"
        className="mx-auto"
        description="The same four steps whether it's a feature or a whole product. Each one ends with something you can look at."
      />
      <ol className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <span
          aria-hidden="true"
          className="absolute top-9 right-[12%] left-[12%] hidden h-0.5 rounded-full bg-border-strong lg:block"
        >
          <span className="block h-full w-full origin-left rounded-full bg-gradient-brand" />
        </span>
        {steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            index={i}
            className="relative flex flex-col items-center gap-4 text-center"
          >
            <span className="relative grid size-[4.5rem] place-items-center rounded-full border border-border-glow bg-card-solid font-display text-2xl font-bold text-foreground shadow-[0_0_0_8px_var(--background),0_0_32px_var(--glow-primary)]">
              <span className="text-gradient">
                {String(i + 1).padStart(2, "0")}
              </span>
            </span>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="max-w-[17rem] text-[0.93rem] leading-relaxed text-muted-foreground">
              {step.description}
            </p>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-muted px-3 py-1 font-mono text-xs text-secondary-strong">
              <ArrowRight aria-hidden="true" className="size-3.5" />
              {step.output}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
