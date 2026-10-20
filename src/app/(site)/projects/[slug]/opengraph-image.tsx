import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame } from "@/lib/og";
import { CONTEXT_LABELS } from "@/lib/schemas/content";
import { getTech } from "@/lib/tech";
import { getProjectBySlug, getProjectSlugs } from "@/server/dal/projects";

export const alt = "Project case study by Md Abdul Mamun";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title ?? "Project";

  return new ImageResponse(
    <OgFrame
      eyebrow={`case study · ${project ? CONTEXT_LABELS[project.context].toLowerCase() : "project"}`}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {project ? (
          <div
            style={{
              fontSize: 30,
              color: "rgba(236,253,245,0.75)",
              maxWidth: 980,
            }}
          >
            {project.tagline}
          </div>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {(project?.stack ?? []).slice(0, 6).map((id) => (
            <div
              key={id}
              style={{
                display: "flex",
                fontSize: 22,
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(16,185,129,0.45)",
                background: "rgba(16,185,129,0.12)",
                color: "#6ee7b7",
              }}
            >
              {getTech(id).label}
            </div>
          ))}
        </div>
      </div>
    </OgFrame>,
    size,
  );
}
