import { ArrowUpRight } from "lucide-react";
import { TechIcon } from "@/components/icons/tech-icon";
import { Badge } from "@/components/ui/badge";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { formatRange } from "@/lib/dates";
import type { Experience } from "@/lib/schemas/content";
import { getTech } from "@/lib/tech";

/** Work history on a rail. `full` shows every highlight (About page). */
export function ExperienceList({
  experience,
  full = false,
  headingLevel = 3,
}: {
  experience: Experience[];
  full?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Timeline>
      {experience.map((job, i) => {
        const range = formatRange(job.start, job.end);
        const current = !job.end;
        return (
          <TimelineItem
            key={job.id}
            current={current}
            last={i === experience.length - 1}
          >
            <article className="flex flex-col gap-4 rounded-3xl border border-border glass p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Heading className="text-xl font-semibold text-foreground">
                    {job.role}
                  </Heading>
                  <p className="text-[0.95rem] text-muted-foreground">
                    {job.companyUrl ? (
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-6 items-center gap-1 rounded-sm font-medium text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {job.company}
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      job.company
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-1.5 sm:items-end">
                  {current ? (
                    <Badge variant="success">Current role</Badge>
                  ) : null}
                  <p className="font-mono text-xs text-muted-foreground">
                    <time dateTime={range.dateTime}>{range.label}</time>
                    <span aria-hidden="true"> · </span>
                    {range.duration}
                  </p>
                </div>
              </div>
              <p className="leading-relaxed text-foreground/90">
                {job.summary}
              </p>
              <ul className="flex flex-col gap-2.5">
                {(full ? job.highlights : job.highlights.slice(0, 3)).map(
                  (item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.93rem] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary"
                      />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <ul className="flex flex-wrap gap-2 pt-1" aria-label="Stack">
                {job.stack.map((id) => (
                  <li key={id}>
                    <Badge
                      variant="outline"
                      size="md"
                      className="text-foreground/85"
                    >
                      <TechIcon id={id} className="size-3.5" />
                      {getTech(id).label}
                    </Badge>
                  </li>
                ))}
              </ul>
            </article>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
