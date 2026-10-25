import { ArrowLeft, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { NAV_ITEMS } from "./nav-config";

/**
 * Placeholder for a module that isn't built yet. Copy comes from the nav
 * registry; `planned` lists what the module will do.
 */
export function ComingSoon({
  href,
  planned,
}: {
  href: string;
  planned: string[];
}) {
  const item = NAV_ITEMS.find((entry) => entry.href === href);
  const Icon = item?.icon ?? Rocket;
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={item?.label ?? "Module"}
        description={item?.description}
        actions={
          <Badge variant="secondary" size="md">
            Coming soon
          </Badge>
        }
      />
      <Card className="flex flex-col items-center gap-6 px-6 py-14 text-center">
        <span
          aria-hidden="true"
          className="grid size-16 place-items-center rounded-3xl border border-border-strong bg-gradient-tile text-primary-strong"
        >
          <Icon className="size-8" />
        </span>
        <div className="flex max-w-lg flex-col gap-2">
          <h2 className="text-xl font-semibold">This module is on the way</h2>
          <p className="text-sm text-muted-foreground">
            It will use the same tables, forms, and security as Users, so it is
            ready to build on. Here is what is planned:
          </p>
        </div>
        <ul className="grid w-full max-w-lg gap-2 text-left text-sm sm:grid-cols-2">
          {planned.map((line) => (
            <li
              key={line}
              className="rounded-2xl border border-border bg-muted/50 px-4 py-2.5 text-muted-foreground"
            >
              {line}
            </li>
          ))}
        </ul>
        <ButtonLink href="/admin" variant="outline">
          <ArrowLeft aria-hidden="true" /> Back to dashboard
        </ButtonLink>
      </Card>
    </div>
  );
}
