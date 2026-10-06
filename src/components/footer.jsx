import Link from "next/link";

import { FOOTER_CONTENT } from "@/constants/home";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="rounded-md text-lg font-bold tracking-tight text-foreground outline-none focus-visible:ring-3 focus-visible:ring-brand/40">
            {FOOTER_CONTENT.brand}
            <span className="text-brand" aria-hidden>
              .
            </span>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{FOOTER_CONTENT.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8">
            {FOOTER_CONTENT.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-brand focus-visible:ring-3 focus-visible:ring-brand/40"
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
