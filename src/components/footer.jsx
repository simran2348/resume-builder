import Link from "next/link";

import { FOOTER_CONTENT } from "@/constants/home";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div className="max-w-xs">
            <Link
              href="/"
              className="rounded-md text-xl font-bold tracking-tight text-heading outline-none focus-visible:ring-3 focus-visible:ring-brand/40"
            >
              {FOOTER_CONTENT.brand}
              <span className="text-brand" aria-hidden>
                .
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{FOOTER_CONTENT.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8">
            {FOOTER_CONTENT.groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-heading">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
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
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {FOOTER_CONTENT.brand}. All rights reserved.
      </div>
    </footer>
  );
}
