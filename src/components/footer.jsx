import Link from "next/link";

import { FOOTER_CONTENT } from "@/constants/home";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="font-semibold tracking-tight text-foreground">{FOOTER_CONTENT.brand}</p>
          <p className="mt-1 text-sm text-muted-foreground">{FOOTER_CONTENT.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FOOTER_CONTENT.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {FOOTER_CONTENT.brand}. All rights reserved.
      </div>
    </footer>
  );
}
