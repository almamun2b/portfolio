"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl w-11 h-11 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 transition-all active:scale-95"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] h-full flex flex-col p-8 border-r border-border/50 bg-background/95 backdrop-blur-2xl"
      >
        <SheetHeader className="text-left mb-5">
          <div className="flex items-center gap-3 mb-2">
            <Logo />
            <SheetTitle className="text-xl font-black tracking-tighter uppercase">
              Abdul <span className="text-primary">Mamun</span>
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs font-bold leading-relaxed tracking-widest text-muted-foreground uppercase">
            Software Engineer Portfolio
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-5">
          <NavMenu
            orientation="vertical"
            className="w-full"
            onClickMenu={() => setIsOpen(false)}
          />
        </div>

        <div className="pt-8 border-t border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
            Let&apos;s Build Something Great
          </p>
        </div>

      </SheetContent>
    </Sheet>
  );
};
