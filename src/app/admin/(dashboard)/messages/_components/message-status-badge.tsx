import { Badge } from "@/components/ui/badge";
import type { MessageDTO } from "@/lib/dto";

const MAP = {
  NEW: { variant: "solid", label: "New" },
  READ: { variant: "outline", label: "Read" },
  ARCHIVED: { variant: "default", label: "Archived" },
} as const;

export function MessageStatusBadge({
  status,
}: {
  status: MessageDTO["status"];
}) {
  const { variant, label } = MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
