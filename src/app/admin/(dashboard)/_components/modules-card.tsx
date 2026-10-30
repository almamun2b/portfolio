import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { NAV_ITEMS } from "@/components/admin/nav-config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const modules = NAV_ITEMS.filter((item) => item.href !== "/admin");

/** Static: part of the prerendered shell. */
export function ModulesCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {modules.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href as Route}
                className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <item.icon
                  aria-hidden="true"
                  className="size-[1.1rem] shrink-0 text-primary-strong"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                {item.status === "soon" ? (
                  <Badge variant="outline">Soon</Badge>
                ) : (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
