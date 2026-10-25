"use client";

import { cn } from "cn";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownForm,
  DropdownLink,
  DropdownSeparator,
  DropdownSubmit,
} from "@/components/ui/dropdown";
import { signOutAction } from "@/server/actions/auth";

export interface MenuUser {
  name: string | null;
  email: string;
}

/**
 * The signed-in user, shown at the foot of the sidebar. `collapsed` reduces
 * the trigger to the avatar; the menu opens upward from the trigger.
 */
export function UserMenu({
  user,
  collapsed = false,
}: {
  user: MenuUser;
  collapsed?: boolean;
}) {
  return (
    <Dropdown
      label="Account menu"
      align="start"
      triggerClassName="flex h-auto w-full items-center justify-start gap-3 rounded-2xl p-2 text-left hover:bg-muted"
      trigger={
        <>
          <Avatar name={user.name} email={user.email} size="sm" />
          <span
            className={cn(
              "flex min-w-0 flex-1 flex-col leading-tight transition-opacity duration-200",
              collapsed && "w-0 flex-none overflow-hidden opacity-0",
            )}
          >
            <span className="truncate text-sm font-medium text-foreground">
              {user.name ?? user.email}
            </span>
            {user.name ? (
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            ) : null}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className={cn("size-4 shrink-0", collapsed && "hidden")}
          />
        </>
      }
    >
      <div role="presentation" className="px-3 py-2">
        <p className="truncate text-sm font-semibold">{user.name ?? "Admin"}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <DropdownSeparator />
      <DropdownLink
        href="/admin/account"
        icon={<UserRound aria-hidden="true" />}
      >
        Account
      </DropdownLink>
      <DropdownForm action={signOutAction}>
        <DropdownSubmit icon={<LogOut aria-hidden="true" />}>
          Sign out
        </DropdownSubmit>
      </DropdownForm>
    </Dropdown>
  );
}
