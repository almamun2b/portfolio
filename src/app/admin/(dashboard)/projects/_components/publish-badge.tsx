import { Badge } from "@/components/ui/badge";

export function PublishBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return (
    <Badge variant={status === "PUBLISHED" ? "success" : "outline"}>
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </Badge>
  );
}
