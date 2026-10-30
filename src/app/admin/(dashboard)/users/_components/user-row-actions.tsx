"use client";

import {
  Ban,
  CircleCheck,
  Ellipsis,
  Eye,
  KeyRound,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Dropdown,
  DropdownItem,
  DropdownLink,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import type { UserDTO } from "@/lib/dto";
import { UserOverlays } from "./user-overlays";
import { useUserPanels } from "./use-user-panels";

const SELF = "You can't do this to your own account.";

/**
 * The row menu. Its overlays live in <UserOverlays>; `afterDelete` lets the
 * detail page leave itself once the user is gone.
 */
export function UserRowActions({
  user,
  isSelf,
  showView = true,
  afterDelete,
}: {
  user: UserDTO;
  isSelf: boolean;
  showView?: boolean;
  afterDelete?: string;
}) {
  const panels = useUserPanels(user, afterDelete);
  const { setPanel, trigger, disabling } = panels;

  return (
    <>
      <Dropdown
        label={`Actions for ${user.name ?? user.email}`}
        triggerRef={trigger}
        trigger={<Ellipsis aria-hidden="true" className="size-[1.1rem]" />}
      >
        {showView ? (
          <DropdownLink
            href={`/admin/users/${user.id}`}
            icon={<Eye aria-hidden="true" />}
          >
            View details
          </DropdownLink>
        ) : null}
        <DropdownItem
          icon={<Pencil aria-hidden="true" />}
          onSelect={() => {
            setPanel("edit");
          }}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          icon={<KeyRound aria-hidden="true" />}
          disabledReason={
            isSelf ? "Change your own password from Account." : undefined
          }
          onSelect={() => {
            setPanel("password");
          }}
        >
          Set password
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          icon={
            disabling ? (
              <Ban aria-hidden="true" />
            ) : (
              <CircleCheck aria-hidden="true" />
            )
          }
          disabledReason={isSelf ? SELF : undefined}
          onSelect={() => {
            setPanel("status");
          }}
        >
          {disabling ? "Disable" : "Enable"}
        </DropdownItem>
        <DropdownItem
          icon={<Trash2 aria-hidden="true" />}
          disabledReason={isSelf ? SELF : undefined}
          onSelect={() => {
            setPanel("delete");
          }}
          className="text-error [&_svg]:text-error"
        >
          Delete
        </DropdownItem>
      </Dropdown>
      <UserOverlays user={user} panels={panels} />
    </>
  );
}
