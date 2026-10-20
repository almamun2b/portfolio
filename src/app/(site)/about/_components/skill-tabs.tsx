import { TechIcon } from "@/components/icons/tech-icon";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";
import type { SkillGroup } from "@/lib/schemas/content";

/** Skill groups as tabs. Every panel is server-rendered (hidden when inactive). */
export function SkillTabs({ groups }: { groups: SkillGroup[] }) {
  const first = groups[0];
  if (!first) return null;
  return (
    <Tabs defaultValue={first.id} className="mt-12 flex flex-col gap-8">
      <TabsList label="Skill groups">
        {groups.map((group) => (
          <TabsTrigger key={group.id} value={group.id}>
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map((group) => (
        <TabsPanel
          key={group.id}
          value={group.id}
          className="rounded-3xl border border-border glass p-6 sm:p-8"
        >
          <p className="mb-6 text-muted-foreground">{group.description}</p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {group.items.map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3.5 font-medium text-foreground transition-[border-color,translate] duration-300 ease-spring hover:-translate-y-0.5 hover:border-border-glow"
              >
                {item.tech ? (
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-tile">
                    <TechIcon id={item.tech} className="size-5" />
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-tile font-mono text-sm text-primary-strong"
                  >
                    {item.name.charAt(0)}
                  </span>
                )}
                {item.name}
              </li>
            ))}
          </ul>
        </TabsPanel>
      ))}
    </Tabs>
  );
}
