"use client";

import { Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import type { ProjectShotDTO } from "@/lib/dto";
import { useFormState } from "./form-state";

type Row = Partial<ProjectShotDTO> & { key: number };

const DEVICES = ["desktop", "mobile", "detail"] as const;

/**
 * Screenshot rows for a project: an image URL (https or a /public path), alt
 * text, and the device it shows. The rows travel as one JSON hidden input
 * named `name`; width and height are optional and default per device on the
 * server. Needs JS; leave it empty to use the designed cover illustration.
 */
export function ShotsField({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: ProjectShotDTO[];
}) {
  const id = useId();
  const error = useFormState().errors[name]?.[0];
  const [rows, setRows] = useState<Row[]>(
    defaultValue.map((shot, key) => ({ ...shot, key })),
  );
  const [nextKey, setNextKey] = useState(defaultValue.length);

  const patch = (key: number, change: Partial<ProjectShotDTO>) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...change } : row)),
    );
  };
  const json = JSON.stringify(
    rows
      .filter((row) => row.src)
      .map(({ key: _key, ...shot }) => ({
        ...shot,
        device: shot.device ?? "desktop",
      })),
  );

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium">Screenshots</legend>
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        Optional. Without screenshots the case study shows the designed cover
        illustration. Use an https:// URL or a path under /public.
      </p>
      <ul className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <li
            key={row.key}
            className="grid grid-cols-1 gap-2 rounded-2xl border border-input bg-card p-3 sm:grid-cols-[1fr_9rem_auto]"
          >
            <Input
              aria-label={`Screenshot ${String(index + 1)} URL`}
              placeholder="https://… or /projects/name/shot.jpg"
              value={row.src ?? ""}
              onChange={(e) => {
                patch(row.key, { src: e.target.value });
              }}
            />
            <Select
              aria-label={`Screenshot ${String(index + 1)} device`}
              value={row.device ?? "desktop"}
              onChange={(e) => {
                patch(row.key, {
                  device: e.target.value as ProjectShotDTO["device"],
                });
              }}
            >
              {DEVICES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Button
              variant="outline"
              aria-label={`Remove screenshot ${String(index + 1)}`}
              onClick={() => {
                setRows((c) => c.filter((r) => r.key !== row.key));
              }}
            >
              <Trash2 aria-hidden="true" />
            </Button>
            <Input
              className="sm:col-span-3"
              aria-label={`Screenshot ${String(index + 1)} description`}
              placeholder="Describe what the screenshot shows"
              value={row.alt ?? ""}
              onChange={(e) => {
                patch(row.key, { alt: e.target.value });
              }}
            />
          </li>
        ))}
      </ul>
      <div>
        <Button
          variant="outline"
          onClick={() => {
            setRows((c) => [...c, { key: nextKey, device: "desktop" }]);
            setNextKey((k) => k + 1);
          }}
        >
          <Plus aria-hidden="true" /> Add screenshot
        </Button>
      </div>
      <input type="hidden" name={name} value={json} />
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
