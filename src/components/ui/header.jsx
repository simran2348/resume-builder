"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8 md:pt-6">
      <div className="mx-auto flex min-h-12 w-full max-w-[800px] items-center justify-between rounded-2xl border border-border bg-background/90 px-3.5 py-2 shadow-sm backdrop-blur-[10px] sm:px-5 md:min-h-14 md:rounded-full md:px-6">
        {/* Logo */}
        <div className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
          Linkfolio
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="size-9 rounded-full"
        >
          {theme === "light" ? (
            <Moon className="size-4 sm:size-5" />
          ) : (
            <Sun className="size-4 sm:size-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
