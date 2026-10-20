import { cn } from "cn";
import { Reveal } from "@/components/effects/reveal";
import { TechIcon } from "@/components/icons/tech-icon";
import { Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";
import type { Service } from "@/lib/schemas/content";
import { getTech } from "@/lib/tech";

/**
 * What I take on. A bento grid rather than six identical tiles: the
 * full-stack card leads at double width, and each card's visual is the real
 * stack it uses instead of a generic icon.
 */
export function Services({ services }: { services: Service[] }) {
  return (
    <Section id="services" aria-labelledby="services-title">
      <SectionHeading
        id="services-title"
        path="services"
        title="What I can"
        highlight="take on"
        description="From a single feature to a whole product: the frontend people use, the services behind it, and the integrations that connect it to everything else."
      />
      <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal
            as="li"
            key={service.id}
            index={i}
            className={cn(
              i === 0 && "md:col-span-2",
              i === services.length - 1 && "md:col-span-2 lg:col-span-3",
            )}
          >
            <Card
              interactive
              className="group flex h-full flex-col gap-6 p-7 sm:p-8"
            >
              <ul
                className="flex flex-wrap gap-2"
                aria-label={`${service.title} stack`}
              >
                {service.stack.map((id) => (
                  <li
                    key={id}
                    className="grid size-11 place-items-center rounded-2xl border border-border bg-gradient-tile transition-transform duration-500 ease-bounce group-hover:scale-110"
                    title={getTech(id).label}
                  >
                    <TechIcon id={id} className="size-5" />
                    <span className="sr-only">{getTech(id).label}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2.5">
                <h3
                  className={cn(
                    "font-semibold text-foreground",
                    i === 0 ? "text-2xl" : "text-[1.2rem]",
                  )}
                >
                  {service.title}
                </h3>
                <p
                  className={cn(
                    "leading-relaxed text-muted-foreground",
                    i === 0 ? "max-w-xl text-[1.02rem]" : "text-[0.93rem]",
                  )}
                >
                  {service.description}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
