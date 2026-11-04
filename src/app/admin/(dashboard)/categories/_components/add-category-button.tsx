"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { CategoryForm } from "./category-form";

export function AddCategoryButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        <Plus aria-hidden="true" /> Add category
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Add category"
        description="Projects and blog posts can use it as soon as it exists."
      >
        {open ? (
          <CategoryForm
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
