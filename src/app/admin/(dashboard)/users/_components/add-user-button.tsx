"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { CreateUserForm } from "./create-user-form";

export function AddUserButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const opener = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={opener}
        onClick={() => {
          setOpen(true);
        }}
      >
        <UserPlus aria-hidden="true" /> Add user
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Add user"
        description="They can sign in right away with the password you set."
      >
        {open ? (
          <CreateUserForm
            onDone={() => {
              setOpen(false);
              router.refresh();
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        ) : null}
      </Drawer>
    </>
  );
}
