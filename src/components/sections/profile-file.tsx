import { formatMonth } from "@/lib/dates";
import { getTech } from "@/lib/tech";
import type { Experience, Profile } from "@/lib/schemas/content";

/**
 * The profile as a JSON file in an editor window: key facts a recruiter
 * scans for, in the medium this engineer works in. Semantically a <dl>.
 */
export function ProfileFile({
  profile,
  current,
}: {
  profile: Profile;
  current: Experience | undefined;
}) {
  const rows: [string, string | string[]][] = [
    ["name", profile.name],
    ["role", profile.role],
    ...(current
      ? ([
          [
            "current",
            `${current.role} @ ${current.company} (since ${formatMonth(current.start)})`,
          ],
        ] as [string, string][])
      : []),
    ["location", profile.location],
    ["timezone", profile.timezone],
    ["stack", profile.primaryStack.map((id) => getTech(id).label)],
    ["open_to", ["full-time", "remote", "contract"]],
  ];

  return (
    <figure className="overflow-hidden rounded-3xl border border-border-strong bg-[color-mix(in_srgb,var(--card-solid)_88%,transparent)] shadow-card backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-3 rounded-full bg-traffic-red/80" />
          <span className="size-3 rounded-full bg-traffic-yellow/80" />
          <span className="size-3 rounded-full bg-traffic-green/80" />
        </span>
        <figcaption className="ml-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-foreground">
          profile.json
        </figcaption>
      </div>
      <div className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-[1.9] sm:p-6 sm:text-[0.85rem]">
        <span aria-hidden="true" className="text-muted-foreground">
          {"{"}
        </span>
        <dl className="pl-4 sm:pl-6">
          {rows.map(([key, value], i) => (
            <div key={key} className="flex flex-wrap gap-x-2">
              <dt className="text-primary-strong">
                &quot;{key}&quot;
                <span aria-hidden="true" className="text-muted-foreground">
                  :
                </span>
              </dt>
              <dd className="text-foreground">
                {Array.isArray(value) ? (
                  <>
                    <span aria-hidden="true" className="text-muted-foreground">
                      [
                    </span>
                    {value.map((item, j) => (
                      <span key={item}>
                        <span className="text-success">&quot;{item}&quot;</span>
                        {j < value.length - 1 ? (
                          <span className="text-muted-foreground">, </span>
                        ) : null}
                      </span>
                    ))}
                    <span aria-hidden="true" className="text-muted-foreground">
                      ]
                    </span>
                  </>
                ) : (
                  <span className="text-secondary-strong">
                    &quot;{value}&quot;
                  </span>
                )}
                {i < rows.length - 1 ? (
                  <span aria-hidden="true" className="text-muted-foreground">
                    ,
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        <span aria-hidden="true" className="text-muted-foreground">
          {"}"}
        </span>
      </div>
    </figure>
  );
}
