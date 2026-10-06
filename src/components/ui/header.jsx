"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menu, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { NAV_LINKS, SITE } from "@/constants/site";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

// Transparent header that floats over the page's top gradient (see Background). It scrolls away with the
// page rather than sticking, so content never shows through behind it.
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="relative z-50 w-full px-4 pt-4 sm:px-6 md:pt-6 lg:px-8">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between gap-4 md:h-14">
        <Link
          href="/"
          className="rounded-md text-xl font-bold tracking-tight text-heading outline-none focus-visible:ring-3 focus-visible:ring-brand/40"
        >
          {SITE.name}
          <span className="text-brand" aria-hidden>
            .
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isCurrent = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
                        isCurrent ? "text-brand" : "text-muted-foreground hover:text-heading"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            className="size-10 rounded-full"
          >
            {theme === "light" ? <Moon className="size-5" aria-hidden /> : <Sun className="size-5" aria-hidden />}
          </Button>

          {/* Small screens: the same links in a menu. */}
          <MenuPrimitive.Root>
            <MenuPrimitive.Trigger
              render={<Button variant="ghost" size="icon" className="size-10 rounded-full md:hidden" />}
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" aria-hidden />
            </MenuPrimitive.Trigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-48 rounded-xl p-1.5">
              {NAV_LINKS.map((link) => (
                <MenuPrimitive.LinkItem
                  key={link.href}
                  render={<Link href={link.href} />}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="flex rounded-lg px-3 py-2.5 text-sm font-medium outline-none data-highlighted:bg-accent aria-[current=page]:text-brand"
                >
                  {link.label}
                </MenuPrimitive.LinkItem>
              ))}
            </DropdownMenuContent>
          </MenuPrimitive.Root>
        </div>
      </div>
    </header>
  );
}
