import { cn } from "cn";
import { GraduationCap, Languages } from "lucide-react";
import type { Education, Profile } from "@/lib/schemas/content";

/** Degree and languages as compact cards (home Experience and /about). */
export function EducationCards({
  education,
  languages,
  className,
}: {
  education: Education[];
  languages: Profile["languages"];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5 lg:sticky lg:top-28", className)}>
      {education.map((item) => (
        <article
          key={item.degree}
          className="flex flex-col gap-3 rounded-3xl border border-border glass p-6"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-tile text-primary-strong">
            <GraduationCap aria-hidden="true" className="size-5" />
          </span>
          <h3 className="text-lg font-semibold">{item.degree}</h3>
          <p className="text-sm text-muted-foreground">
            {item.school}, {item.place}
            <span aria-hidden="true"> · </span>
            <span className="font-mono text-xs">
              {item.start}–{item.end}
            </span>
          </p>
          <p className="text-[0.92rem] leading-relaxed text-muted-foreground">
            {item.note}
          </p>
        </article>
      ))}
      <article className="flex flex-col gap-3 rounded-3xl border border-border glass p-6">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-tile text-secondary-strong">
          <Languages aria-hidden="true" className="size-5" />
        </span>
        <h3 className="text-lg font-semibold">Languages</h3>
        <dl className="flex flex-col gap-2 text-sm">
          {languages.map((language) => (
            <div key={language.name} className="flex justify-between gap-4">
              <dt className="font-medium text-foreground">{language.name}</dt>
              <dd className="text-right text-muted-foreground">
                {language.level}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}
