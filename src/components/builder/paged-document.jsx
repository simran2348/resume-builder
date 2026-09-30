"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { DEFAULT_THEME } from "@/constants/builder";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

// A4 at 96 DPI.
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;

// Renders a resume as separate A4 pages with real page breaks (see paginate.js), scaled by `scale`.
// Used by the builder preview, the PDF / print copy, template previews and thumbnails so they all match.
//
// - `template` is from getTemplate(): its `Component` renders the resume and optional `PageBackground`
//   draws per-page decoration at full page height (e.g. the Sidebar template's coloured column).
// - `maxPages` limits how many pages are drawn (1 for thumbnails).
// - `print` draws exact 210 × 297 mm sheets with page breaks between them instead of scaled pages.
// - `pagesRef` goes on the element wrapping the pages (what gets printed); `hidden` hides the pages on screen
//   while keeping the off-screen measuring copy measurable (it must not sit inside display: none).
export default function PagedDocument({
  template,
  resume,
  theme,
  scale = 1,
  gap = 24,
  maxPages,
  dimmed = false,
  print = false,
  pagesRef,
  hidden = false,
  className,
  pageClassName,
}) {
  const { Component, PageBackground } = template;
  const resolvedTheme = { ...DEFAULT_THEME, ...theme };
  const { measureRef, pages } = usePagination(resolvedTheme.pageMargin, [resume, theme, Component]);
  const shown = maxPages ? pages.slice(0, maxPages) : pages;

  return (
    <>
      {/* Unscaled, off-screen copy that pagination measures. Portalled to <body> so it's never inside a
          transformed or clipped container (dialogs, scaled previews). */}
      {createPortal(
        <div
          aria-hidden
          className="pointer-events-none invisible fixed top-0 -left-[10000px]"
          style={{ width: PAGE_WIDTH }}
        >
          <div ref={measureRef} className="relative">
            <Component resume={resume} theme={theme} />
          </div>
        </div>,
        document.body
      )}

      <div className={cn(hidden && "hidden")}>
        <div ref={pagesRef} className={cn("flex flex-col", className)} style={{ gap: print ? 0 : gap }}>
          {shown.map((page, index) => (
            <div
              key={index}
              className={cn("shrink-0 overflow-hidden", pageClassName)}
              style={
                print
                  ? {
                      width: "210mm",
                      height: "297mm",
                      breakAfter: index < shown.length - 1 ? "page" : "auto",
                    }
                  : { width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }
              }
            >
              <div
                className="relative origin-top-left overflow-hidden"
                style={{
                  width: PAGE_WIDTH,
                  height: PAGE_HEIGHT,
                  transform: scale === 1 ? undefined : `scale(${scale})`,
                  backgroundColor: resolvedTheme.background,
                }}
              >
                {PageBackground && (
                  <div className={cn("absolute inset-0", dimmed && "opacity-45")}>
                    <PageBackground theme={theme} pageIndex={index} />
                  </div>
                )}
                {/* This page's slice of the content, clipped at a clean break. */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    marginTop: page.offset,
                    height: page.end - page.start,
                  }}
                >
                  <div
                    style={{ transform: `translateY(-${page.start}px)` }}
                    aria-hidden={index > 0 || dimmed}
                    className={cn(dimmed && "opacity-45")}
                  >
                    <Component resume={resume} theme={theme} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Calls `children(scale)` with the scale that fits a page to the container's width (max 1).
export function FitWidth({ children, className }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / PAGE_WIDTH)));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {scale > 0 && children(scale)}
    </div>
  );
}
