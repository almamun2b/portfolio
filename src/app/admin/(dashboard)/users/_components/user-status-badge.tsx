import { Badge } from "@/components/ui/badge";
import type { UserDTO } from "@/lib/dto";

export function UserStatusBadge({ status }: { status: UserDTO["status"] }) {
  return status === "ACTIVE" ? (
    <Badge variant="success">Active</Badge>
  ) : (
    <Badge variant="danger">Disabled</Badge>
  );
}
