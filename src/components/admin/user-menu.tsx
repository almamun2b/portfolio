"use client";

import { ChevronDown, LogOut, UserRound } from "lucide-react";
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

export function UserMenu({ user }: { user: MenuUser }) {
  return (
    <Dropdown
      label="Account menu"
      triggerClassName="inline-flex h-auto w-auto items-center gap-2 rounded-full border border-border-strong bg-card py-1 pr-3 pl-1 hover:border-primary"
      trigger={
        <>
          <Avatar name={user.name} email={user.email} size="sm" />
          <span className="hidden max-w-32 truncate text-sm font-medium text-foreground md:inline">
            {user.name ?? user.email}
          </span>
          <ChevronDown aria-hidden="true" className="size-3.5" />
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
