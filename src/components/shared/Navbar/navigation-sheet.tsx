"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-sm">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetTitle className="sr-only">Menu</SheetTitle>
      <SheetDescription className="sr-only">
        This is the content of the sheet.
      </SheetDescription>
      <SheetContent
        side="left"
        className="flex flex-col justify-start p-4 pt-2"
      >
        <Logo />
        <NavMenu
          orientation="vertical"
          className="flex flex-col justify-start items-start"
          onClickMenu={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};
