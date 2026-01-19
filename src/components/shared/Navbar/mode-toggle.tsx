"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          className="cursor-pointer"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-40 p-1">
        <div className="flex flex-col gap-1">
          <Button
            variant={theme === "light" ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>

          <Button
            variant={theme === "dark" ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>

          <Button
            variant={theme === "system" ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
          >
            <Monitor className="mr-2 h-4 w-4" />
            System
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
