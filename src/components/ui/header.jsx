"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/constants/site";
import { useTheme } from "@/context/ThemeContext";

// Transparent header that floats over the page's top gradient (see Background). It scrolls away with the
// page rather than sticking, so content never shows through behind it.
export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative z-50 w-full px-4 pt-4 sm:px-6 md:pt-6 lg:px-8">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between md:h-14">
        <Link
          href="/"
          className="rounded-md text-lg font-bold tracking-tight text-foreground outline-none focus-visible:ring-3 focus-visible:ring-brand/40 sm:text-xl"
        >
          {SITE.name}
          <span className="text-brand" aria-hidden>
            .
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          className="size-10 rounded-full"
        >
          {theme === "light" ? <Moon className="size-5" aria-hidden /> : <Sun className="size-5" aria-hidden />}
        </Button>
      </div>
    </header>
  );
}
